package com.fingerone.BisServer.repository;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fingerone.BisServer.model.CodeList;

public interface CodeListRepository  extends JpaRepository<CodeList, Long>{

  Collection<CodeList> findByManual_nome(String nomeManual);
	
	
}