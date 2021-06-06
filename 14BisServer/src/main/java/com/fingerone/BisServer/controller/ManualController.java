package com.fingerone.BisServer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fingerone.BisServer.entity.Manual;
import com.fingerone.BisServer.message.ResponseMessage;
import com.fingerone.BisServer.repository.ManualRepository;

import io.swagger.annotations.Api;

@CrossOrigin("http://localhost:3000")
@Controller
@RequestMapping("/api/manual")
@Api(value = "Manual")
public class ManualController {

	@Autowired
	ManualRepository repository;

	@GetMapping
	public ResponseEntity<List<Manual>> getAllManuals() {
		try {
			List<Manual> manuals = repository.findAll();

			if (manuals.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(manuals, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/update")
	public ResponseEntity<ResponseMessage> updateManualName(@RequestParam String manualData) {
		try {
			String[] manualIdName = manualData.split(",");
			
			Manual manual = repository.findById(Long.valueOf(manualIdName[0])).get();
			manual.setNome(manualIdName[1]);
			
			repository.save(manual);
			return new ResponseEntity<>(new ResponseMessage("Manual successfully update"), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(new ResponseMessage("Error when updating manual"), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
