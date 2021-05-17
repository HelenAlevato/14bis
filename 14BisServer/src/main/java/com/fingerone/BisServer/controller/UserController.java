package com.fingerone.BisServer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fingerone.BisServer.entity.User;
import com.fingerone.BisServer.repository.UserRepository;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("user")
@Api(value = "User")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> listAll() {
        List<User> listUsers = userRepository.findAll();
        if (!listUsers.isEmpty())
            return new ResponseEntity<>(listUsers, HttpStatus.OK);
        else
            return new ResponseEntity<>(listUsers, HttpStatus.NOT_FOUND);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> save(@RequestBody User user) {
        try {
            return new ResponseEntity<>(userRepository.save(user), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

}
