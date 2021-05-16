package com.fingerone.BisServer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.fingerone.BisServer.entity.PdfPage;

@Repository
public interface PdfPageRepository extends CrudRepository<PdfPage, Long> {
    PdfPage findFirstByBlockAndCodeAndPage(String block, String code, Long page);
}
