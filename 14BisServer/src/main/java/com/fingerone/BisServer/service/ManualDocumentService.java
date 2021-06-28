package com.fingerone.BisServer.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManualDocumentService {
	
	@Autowired
	private PdfPageService pdfPageService;
	
	public byte[] getManualDocument(String nomeManual, String aplicabilidade, int revision, String docType) throws IOException {
		String fileName = nomeManual + aplicabilidade + "-Rev" + String.valueOf(revision) + "-" + docType + ".pdf";
		String filePath = pdfPageService.getRootPdfPath() + "\\" + nomeManual + "\\master\\" + fileName;
		File file = new File(filePath);
		byte[] contents = Files.readAllBytes(file.toPath());

		return contents;
	}
}
