package com.fingerone.BisServer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fingerone.BisServer.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
