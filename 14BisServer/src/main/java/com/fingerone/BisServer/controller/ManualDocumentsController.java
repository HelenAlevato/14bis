package com.fingerone.BisServer.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fingerone.BisServer.service.ManualDocumentService;

import io.swagger.annotations.Api;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("ManualDocuments")
@Api(value = "Manual Documents")
public class ManualDocumentsController {
	@Autowired
	private ManualDocumentService manualDocumentService;

	@PostMapping
	public ResponseEntity<byte[]> getPDF(@RequestParam String remark, @RequestParam String manualName,
			@RequestParam int revision, @RequestParam String docType) throws IOException {
		
		ResponseEntity<byte[]> response;
		
		try {
			byte[] contents = manualDocumentService.getManualDocument(manualName, remark, revision, docType);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);

			headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
			response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
		} catch (Exception e) {
			response = new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
		return response;
	}
}
