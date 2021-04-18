package com.fingerone.BisServer.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "codelists")
public class CodeList {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
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
	
	public CodeList() {
		
	}
	
	public CodeList(String secao, String subSecao, String bloco, String nomeBloco, String codigo, String aplicabilidade,
			String tag) {
		super();
		this.secao = secao;
		this.subSecao = subSecao;
		this.bloco = bloco;
		this.nomeBloco = nomeBloco;
		this.codigo = codigo;
		this.aplicabilidade = aplicabilidade;
		this.tag = tag;
	}



	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public String getSecao() {
		return secao;
	}



	public void setSecao(String secao) {
		this.secao = secao;
	}



	public String getSubSecao() {
		return subSecao;
	}



	public void setSubSecao(String subSecao) {
		this.subSecao = subSecao;
	}



	public String getBloco() {
		return bloco;
	}



	public void setBloco(String bloco) {
		this.bloco = bloco;
	}



	public String getNomeBloco() {
		return nomeBloco;
	}



	public void setNomeBloco(String nomeBloco) {
		this.nomeBloco = nomeBloco;
	}



	public String getCodigo() {
		return codigo;
	}



	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}



	public String getAplicabilidade() {
		return aplicabilidade;
	}



	public void setAplicabilidade(String aplicabilidade) {
		this.aplicabilidade = aplicabilidade;
	}



	public String getTag() {
		return tag;
	}



	public void setTag(String tag) {
		this.tag = tag;
	}
}