package com.fingerone.BisServer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fingerone.BisServer.entity.Manual;

@Repository
public interface ManualRepository extends JpaRepository<Manual, Long> {
}