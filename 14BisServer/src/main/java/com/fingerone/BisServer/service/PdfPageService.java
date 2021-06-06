package com.fingerone.BisServer.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

import javax.transaction.Transactional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.fingerone.BisServer.entity.PageRevision;
import com.fingerone.BisServer.entity.PdfPage;
import com.fingerone.BisServer.enums.ProcessStatus;
import com.fingerone.BisServer.helper.PdfHelper;
import com.fingerone.BisServer.model.ProcessPdfResponse;
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
    private PdfHelper pdfHelper;
    @Value("classpath:pdf/*")
    private Resource[] pdfResources;
    @Value("${pdf.pages.dir}")
    private String rootPdfPath;

    public void createNewPdf() throws IOException {
    	PDDocument novoPDF = new PDDocument();
    	String nomePDF = "newPDFDocument";
    	String caminhoCompleto = this.rootPdfPath + "/" + nomePDF + ".pdf";
    	for (int i=0; i<10; i++) {
            //Creating a blank page 
            PDPage blankPage = new PDPage();

            //Adding the blank page to the document
            novoPDF.addPage( blankPage );
         } 
    	novoPDF.save(caminhoCompleto);
    	novoPDF.close();
    }
    
    public byte[] getExistentPDF() throws IOException {
    	String fileName = "ABC-1234-50-REV6-FULL.pdf";
    	String filePath = rootPdfPath + "/" + fileName;
    	File file = new File(filePath);
        byte[] contents = Files.readAllBytes(file.toPath());
        
        return contents;
    }
    
    @Transactional
    public ProcessPdfResponse extractPagesOfPdfs() throws IOException {
        List<PdfPage> pdfPageList = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        sb.append("[ ");
        for (final Resource res : pdfResources) {
            sb.append(res.getURI().getPath());
            sb.append(" | ");
            extractPageDataAllPages(res.getURI().getPath(), pdfPageList);
        }
        int lastPipeIndex = sb.toString().lastIndexOf('|');
        pdfPageRepository.saveAll(pdfPageList);
        ProcessPdfResponse response = ProcessPdfResponse.builder()
                .numberOfPages(new Long(pdfPageList.size()))
                .status(ProcessStatus.SUCCESS)
                .files(sb.substring(0, lastPipeIndex) + ']')
                .build();
        return response;
    }

    private void extractPageDataAllPages(String pdfPath, List<PdfPage> pdfPageList) throws IOException {
        PDDocument document = null;
        try {
            document = PDDocument.load(new File(pdfPath));
            int pageIndex = 2;
            while (pageIndex < document.getNumberOfPages()) {
                extractPageDataEachPage(document.getPage(pageIndex++), pdfPageList);
            }
        } catch (IOException e) {
            log.error("Fail loading PDF file", e);
        } finally {
            if(document != null)
                document.close();
        }
    }

    private void extractPageDataEachPage(PDPage page, List<PdfPage> pdfPageList) throws IOException {
        String extractedContent = pdfHelper.extractFooterData(page);
        String[] splittedData = extractedContent.trim().split("\n");
        // Creating PdfPage
        String strPage = pdfHelper.getPageValue(splittedData[1], "-1")
                .replaceFirst("(?i)page", "").trim();
        PdfPage pdfPage = PdfPage.builder()
                .block(splittedData[0].trim())
                .page(new Long(strPage))
                .code(pdfHelper.getCodeValue(splittedData[1], "-1"))
                .revisions(new ArrayList<>())
                .build();
        log.info(pdfPage.toString());
        // Verifying if PdfPage already exists in List<PdfPage>
        PdfPage pdfPageFound = pdfPageRepository
                .findFirstByBlockAndCodeAndPage(pdfPage.getBlock(), pdfPage.getCode(), pdfPage.getPage());
        if(pdfPageList.contains(pdfPage)) {
            pdfPage = pdfPageList.get(pdfPageList.indexOf(pdfPage));
        } else {
            if(pdfPageFound != null)
                pdfPage = pdfPageFound;
            pdfPageList.add(pdfPage);
        }
        // Creating PageRevision and adding in PdfPage revisions
        PageRevision revision = PageRevision.builder()
                .revision(pdfHelper.getRevisionValue(splittedData[1], null))
                .pdfPage(pdfPage)
                .build();
        revision.setFileName(revision.getPathStorageFile());
        if(!pdfPage.getRevisions().contains(revision)) {
            pdfPage.getRevisions().add(revision);
        }
        pdfHelper.extractPageInNewPdfFile(page, rootPdfPath + revision.getFileName());
    }
}
