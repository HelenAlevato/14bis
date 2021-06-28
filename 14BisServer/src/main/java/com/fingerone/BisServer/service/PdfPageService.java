package com.fingerone.BisServer.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.transaction.Transactional;

import org.apache.logging.log4j.util.Strings;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.fingerone.BisServer.entity.CodeList;
import com.fingerone.BisServer.entity.PageRevision;
import com.fingerone.BisServer.entity.PdfPage;
import com.fingerone.BisServer.enums.ProcessStatus;
import com.fingerone.BisServer.helper.PdfHelper;
import com.fingerone.BisServer.model.ProcessPdfResponse;
import com.fingerone.BisServer.repository.CodeListRepository;
import com.fingerone.BisServer.repository.PdfPageRepository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Data
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class PdfPageService {
	private Pattern revisionPattern = Pattern.compile("(revision \\d{1,5}|original)", Pattern.CASE_INSENSITIVE);
	private Pattern codePattern = Pattern.compile("code \\d{1,5}", Pattern.CASE_INSENSITIVE);
	private Pattern pagePattern = Pattern.compile("page \\d{1,5}", Pattern.CASE_INSENSITIVE);

	@Autowired
	private PdfPageRepository pdfPageRepository;
	@Autowired
	private CodeListRepository codelistRepository;
	@Autowired
	private PdfHelper pdfHelper;
	@Value("classpath:pdf/*.pdf")
	private Resource[] pdfResources;
	@Value("${pdf.pages.dir}")
	private String rootPdfPath;

	public void createNewPdf(String manualName, String remark, String docType) throws IOException {
		String pdfName = manualName + remark + "-Rev6" + "-" + docType;
		String fullPath = this.rootPdfPath + "/" + manualName + "/" + pdfName + ".pdf";

		String[] remarks = new String[] { remark, "ALL" };
		List<PdfPage> pdfPageList = new ArrayList<>();

		for (CodeList code : (List<CodeList>) codelistRepository.findByAplicabilidades(remarks)) {
			String block = "";
			if (docType.equalsIgnoreCase("full")) {
				block = code.getSecao().startsWith("0") ? code.getSecao().substring(1) : code.getSecao();
				if (Strings.isNotBlank(code.getSubSecao())) {
					block += "-" + code.getSubSecao();
				}
				block += "-" + code.getBloco();
			} else if (docType.equalsIgnoreCase("lep")) {
				block = "0-LEP";
			}
			
			pdfPageList.addAll(pdfPageRepository.findByBlockAndCode(block, "code " + code.getCodigo()));
		}

		List<File> filesToMerge = new ArrayList<>();
		for (PdfPage page : pdfPageList) {
			filesToMerge.add(new File(rootPdfPath + File.separator + manualName + File.separator
					+ page.getRevisions().get(0).getFileName()));
		}

		PDFMergerUtility pdfMerger = new PDFMergerUtility();
		pdfMerger.setDestinationFileName(fullPath);
		for (File file : filesToMerge) {
			pdfMerger.addSource(file);
		}
		pdfMerger.mergeDocuments(null);
	}

	public ArrayList<File> findMasterDirectoryFiles(String manualName) throws IOException {
		String pdfRootPath = "C:\\Users\\helen\\OneDrive\\Documentos\\14bis\\14BisServer\\src\\main\\resources\\pdf";
		File file = new File(pdfRootPath + "\\" + manualName + "\\master");
		ArrayList<File> files = new ArrayList<>();
		Files.walk(file.toPath()).filter(Files::isRegularFile).filter(f -> f.getFileName().toString().endsWith(".pdf"))
				.forEach(f -> files.add(f.toFile()));
		return files;
	}

	@Transactional
	public ProcessPdfResponse extractPagesOfPdfs(String manualName) throws IOException {
		List<File> files = findMasterDirectoryFiles(manualName);

		List<PdfPage> pdfPageList = new ArrayList<>();
		StringBuilder sb = new StringBuilder();
		sb.append("[ ");
		for (final File f : files) {
			sb.append(f.getPath());
			sb.append(" | ");
			extractPageDataAllPages(f.getPath(), pdfPageList);
		}
		int lastPipeIndex = sb.toString().lastIndexOf('|');
		pdfPageRepository.saveAll(pdfPageList);
		ProcessPdfResponse response = ProcessPdfResponse.builder().numberOfPages(new Long(pdfPageList.size()))
				.status(ProcessStatus.SUCCESS).files(sb.substring(0, lastPipeIndex) + ']').build();
		return response;
	}

	private void extractPageDataAllPages(String pdfPath, List<PdfPage> pdfPageList) throws IOException {
		PDDocument document = null;
		try {
			document = PDDocument.load(new File(pdfPath));
			int pageIndex = 0;
			while (pageIndex < document.getNumberOfPages()) {
				extractPageDataEachPage(new File(pdfPath).getName(), document.getPage(pageIndex++), pdfPageList);
			}
		} catch (IOException e) {
			log.error("Fail loading PDF file", e);
		} finally {
			if (document != null)
				document.close();
		}
	}

	private void extractPageDataEachPage(String originFileName, PDPage page, List<PdfPage> pdfPageList) throws IOException {
		String extractedContent = pdfHelper.extractFooterData(page);
		String[] splittedData = extractedContent.trim().split("\n");
		// Creating PdfPage
		if (splittedData.length > 1) {
			PdfPage pdfPage = PdfPage.builder().block(splittedData[0].trim())
					.page(new Long(pdfHelper.getPageValue(splittedData[1], "-1").replaceFirst("(?i)page", "").trim()))
					.code(pdfHelper.getCodeValue(splittedData[1], "-1")).revisions(new ArrayList<>()).build();

			log.info(pdfPage.toString());
			// Verifying if PdfPage already exists in List<PdfPage>
			PdfPage pdfPageFound = pdfPageRepository.findFirstByBlockAndCodeAndPage(pdfPage.getBlock(),
					pdfPage.getCode(), pdfPage.getPage());
			if (pdfPageList.contains(pdfPage)) {
				pdfPage = pdfPageList.get(pdfPageList.indexOf(pdfPage));
			} else {
				if (pdfPageFound != null)
					pdfPage = pdfPageFound;
				pdfPageList.add(pdfPage);
			}
			// Creating PageRevision and adding in PdfPage revisions
			PageRevision revision = PageRevision.builder()
					.revision(pdfHelper.getRevisionValue(splittedData[1], null))
					.pdfPage(pdfPage).build();
			revision.setFileName(revision.getPathStorageFile());
			if (!pdfPage.getRevisions().contains(revision)) {
				pdfPage.getRevisions().add(revision);
			}
			pdfHelper.extractPageInNewPdfFile(page, rootPdfPath + "\\ABC-1234\\" + revision.getFileName());
		} else {
			// tratar aqui as paginas que nao possuem rodapé (cover, letter)
			// Este processo abaixo ainda não funciona

//			splittedData = originFileName.replace(".pdf", "").split("-");
//			splittedData = splittedData[splittedData.length - 1].split("c");
//			PdfPage pdfPage = PdfPage.builder()
//					.block(splittedData[0])
//					.page(0L)
//					.code(splittedData[1])
//					.revisions(new ArrayList<>()).build();
//
//			PdfPage pdfPageFound = pdfPageRepository.findFirstByBlockAndCodeAndPage(pdfPage.getBlock(),
//					pdfPage.getCode(), pdfPage.getPage());
//			if (pdfPageList.contains(pdfPage)) {
//				pdfPage = pdfPageList.get(pdfPageList.indexOf(pdfPage));
//			} else {
//				if (pdfPageFound != null)
//					pdfPage = pdfPageFound;
//				pdfPageList.add(pdfPage);
//			}
//
//			// Creating PageRevision and adding in PdfPage revisions
//			PageRevision revision = PageRevision.builder()
//					.revision("0")
//					.pdfPage(pdfPage).build();
//			revision.setFileName(revision.getPathStorageFile());
//			if (!pdfPage.getRevisions().contains(revision)) {
//				pdfPage.getRevisions().add(revision);
//			}
//			pdfHelper.extractPageInNewPdfFile(page, rootPdfPath + "\\ABC-1234\\" + revision.getFileName());
		}
	}

	public void createNewManualDirectory(String nomeManual) {
		File file = new File(rootPdfPath + "/" + nomeManual);
		file.mkdir();
	}
}