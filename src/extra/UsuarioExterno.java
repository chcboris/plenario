package br.jus.trerj.plenario_virtual_api.domain.model;

import java.util.Date;
import java.util.Objects;

import br.jus.trerj.plenario_virtual_api.api.dto.UsuarioExternoDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(schema="plenario_virtual", name = "usuario_externo")
@SequenceGenerator(name = "sqUsuarioExterno", sequenceName = "seq_usuario_externo", schema = "plenario_virtual", allocationSize=1)
public class UsuarioExterno {

	@Id
	@Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sqUsuarioExterno")
	private Long id;

	@Column(name = "cpf")
	private String cpf;

	@Column(name = "nome")
	private String nome;

	@Column(name = "email")
	private String email;

	@Column(name = "dt_ultima_atualizacao")
	private Date ultimaAtualizacao;
	
	@Column(name = "dt_revogacao_acesso")
	private Date revogacaoAcesso;
	
	@Column(name = "senha")
	private String senha;

	@Column(name = "oab")
	private String oab;
	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getUltimaAtualizacao() {
		return ultimaAtualizacao;
	}

	public void setUltimaAtualizacao(Date ultimaAtualizacao) {
		this.ultimaAtualizacao = ultimaAtualizacao;
	}

	public Date getRevogacaoAcesso() {
		return revogacaoAcesso;
	}

	public void setRevogacaoAcesso(Date revogacaoAcesso) {
		this.revogacaoAcesso = revogacaoAcesso;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}
		
	public String getOab() {
		return oab;
	}

	public void setOab(String oab) {
		this.oab = oab;
	}

	public UsuarioExternoDTO converterDTO() {
		return new UsuarioExternoDTO(id, cpf, nome, email, ultimaAtualizacao, revogacaoAcesso, senha, oab);
	}

	@Override
	public int hashCode() {
		return Objects.hash(cpf, email, id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UsuarioExterno other = (UsuarioExterno) obj;
		return Objects.equals(cpf, other.cpf) && Objects.equals(email, other.email) && Objects.equals(id, other.id);
	}
	
	

}
