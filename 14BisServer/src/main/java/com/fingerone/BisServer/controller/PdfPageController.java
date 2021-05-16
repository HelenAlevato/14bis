package com.fingerone.BisServer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fingerone.BisServer.entity.PdfPage;
import com.fingerone.BisServer.model.ProcessPdfResponse;
import com.fingerone.BisServer.repository.PdfPageRepository;
import com.fingerone.BisServer.service.PdfPageService;

@RestController
@RequestMapping("pdfpage")
public class PdfPageController {
    @Autowired
    private PdfPageRepository pdfPageRepository;
    @Autowired
    private PdfPageService pdfExtractorService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PdfPage>> listAll() {
        List<PdfPage> pdfPageList = (List<PdfPage>) pdfPageRepository.findAll();
        if (!pdfPageList.isEmpty())
            return new ResponseEntity<>(pdfPageList, HttpStatus.OK);
        else
            return new ResponseEntity<>(pdfPageList, HttpStatus.NOT_FOUND);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProcessPdfResponse> process() {
        try {
            ProcessPdfResponse response = pdfExtractorService.extractPagesOfPdfs();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(new ProcessPdfResponse(), HttpStatus.BAD_REQUEST);
        }
    }

}
