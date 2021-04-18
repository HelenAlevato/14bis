package com.fingerone.BisServer.service;

import java.io.IOException;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fingerone.BisServer.helper.ExcelHelper;
import com.fingerone.BisServer.model.CodeList;
import com.fingerone.BisServer.repository.CodeListRepository;



@Service
public class ExcelService {
	
	  @Autowired
	  CodeListRepository repository;

	  public void save(MultipartFile file) {
	    try {
	      List<CodeList> codelists = ExcelHelper.excelToCodeLists(file.getInputStream());
	      repository.saveAll(codelists);
	    } catch (IOException e) {
	      throw new RuntimeException("fail to store excel data: " + e.getMessage());
	    }
	  }

	  public List<CodeList> getAllCodelists() {
	    return repository.findAll();
	  }

}