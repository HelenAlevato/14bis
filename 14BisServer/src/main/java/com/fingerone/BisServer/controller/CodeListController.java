package com.fingerone.BisServer.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.fingerone.BisServer.entity.Manual;
import com.fingerone.BisServer.helper.ExcelHelper;
import com.fingerone.BisServer.message.ResponseMessage;
import com.fingerone.BisServer.model.CodeList;
import com.fingerone.BisServer.repository.CodeListRepository;
import com.fingerone.BisServer.service.ExcelService;

import io.swagger.annotations.Api;

@CrossOrigin("http://localhost:3000")
@Controller
@RequestMapping("/api/codelist")
@Api(value = "Codelist")
public class CodeListController {

	@Autowired
	ExcelService fileService;

	@Autowired
	CodeListRepository repository;

	@PostMapping("/upload")
	public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file,
			@RequestParam("nomeManual") String nomeManual) {
		String message = "";

		if (ExcelHelper.hasExcelFormat(file)) {
			Manual manual = new Manual();
			manual.setNome(nomeManual);
			manual.setDate(new Date());

			try {
				fileService.save(file, manual);

				message = "Uploaded the file successfully: " + file.getOriginalFilename();
				return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
			} catch (Exception e) {
				message = "Could not upload the file: " + file.getOriginalFilename() + "!";
				return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
			}
		}

		message = "Please upload an excel file!";
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage(message));
	}

	@PostMapping("/delete")
	public ResponseEntity<ResponseMessage> deleteCodelists(@RequestParam("idsToDelete") String idsToDelete) {
		String message = "";
		try {
			String[] ids = idsToDelete.split(",");
			for (String id : ids) {
				repository.deleteById(Long.valueOf(id));
			}
			
			message = "Codelists succesfully deleted";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Error while deleting codelists";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@GetMapping
	public ResponseEntity<List<CodeList>> getAllCodelists() {
		try {
			List<CodeList> codelist = fileService.getAllCodelists();

			if (codelist.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(codelist, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/manual/{nomeManual}")
	public ResponseEntity<List<CodeList>> getCodelistByManual(@PathVariable("nomeManual") String nomeManual) {
		try {
			List<CodeList> codelist = fileService.getAllCodelistsByManualName(nomeManual);

			if (codelist.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(codelist, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
