package com.fingerone.BisServer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;


@CrossOrigin("http://localhost:3000")
@Controller
@RequestMapping("/api/codelist")
public class CodeListController {

	@PostMapping("/upload")
	public void uploadFile(@RequestParam("file") MultipartFile file) {

		

	}
}