package com.fingerone.BisServer.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "codelists")
@AllArgsConstructor
@NoArgsConstructor
public class CodeList {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne(cascade=CascadeType.PERSIST)
    @JoinColumn(name = "cod_manual", referencedColumnName = "cod_manual")
    private Manual manual;
	
	@Column(name = "secao")
	private String secao;
	
	@Column(name = "subSecao")
	private String subSecao;
	
	@Column(name = "bloco")
	private String bloco;
	
	@Column(name = "nomeBloco")
	private String nomeBloco;
	
	@Column(name = "codigo")
	private String codigo;
	
	@Column(name = "aplicabilidade")
	private String aplicabilidade;
	
	@Column(name = "tag")
	private String tag;
}