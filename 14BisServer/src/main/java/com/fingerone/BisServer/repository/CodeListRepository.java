package com.fingerone.BisServer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fingerone.BisServer.model.CodeList;

public interface CodeListRepository  extends JpaRepository<CodeList, Long>{

}