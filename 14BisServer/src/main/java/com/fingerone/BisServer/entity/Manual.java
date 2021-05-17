package com.fingerone.BisServer.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "manual")
@AllArgsConstructor
@NoArgsConstructor
public class Manual {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cod_manual")
    private Long codManual;
    private String nome;
    private String url;
    private Date date;
}
