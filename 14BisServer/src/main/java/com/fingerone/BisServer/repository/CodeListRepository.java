package com.fingerone.BisServer.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fingerone.BisServer.entity.CodeList;

public interface CodeListRepository  extends JpaRepository<CodeList, Long>{

  Collection<CodeList> findByManual_nome(String nomeManual);
  
  @Query("SELECT c FROM CodeList c WHERE c.aplicabilidade IN (:remarks)")
  Collection<CodeList> findByAplicabilidades(@Param("remarks") String[] remarks);
	
}