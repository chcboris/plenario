package br.jus.trerj.plenario_virtual_api.domain.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import br.jus.trerj.plenario_virtual_api.api.dto.ProcessoSustentacaoDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(schema = "plenario_virtual", name = "LISTA_PROCESSOS_SOLICITACAO")
public class ProcessoSustentacao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id")
	private Long id;

	@Column(name = "id_sessao")
	private Long idSessao;

	@Column(name = "sessao_data")
	private Date sessaoData;

	@Column(name = "sessao_tipo")
	private String sessaoTipo;

	@Column(name = "id_processo")
	private Long idProcesso;

	@Column(name = "ordem_pauta")
	private Long ordemPauta;

	@Column(name = "numero_processo")
	private String numeroProcesso;

	@Column(name = "relator")
	private String juizRelator;

	@Column(name = "status")
	private String status;

	@Column(name = "nome_advogado")
	private String advogadoNome;

	@Column(name = "advogado_codigo_oab")
	private String advogadoCodigoOab;

	@Column(name = "advogado_situacao")
	private String advogadoSituacao;

	@Column(name = "email")
	private String email;

	@Column(name = "telefone")
	private String telefone;	
	
	@Column(name = "partes_processo")
	private String partes_processo;

	@Column(name = "classe")
	private String classe;	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIdSessao() {
		return idSessao;
	}

	public void setIdSessao(Long idSessao) {
		this.idSessao = idSessao;
	}

	public Date getSessaoData() {
		return sessaoData;
	}

	public void setSessaoData(Date sessaoData) {
		this.sessaoData = sessaoData;
	}

	public String getSessaoTipo() {
		return sessaoTipo;
	}

	public void setSessaoTipo(String sessaoTipo) {
		this.sessaoTipo = sessaoTipo;
	}

	public Long getIdProcesso() {
		return idProcesso;
	}

	public void setIdProcesso(Long idProcesso) {
		this.idProcesso = idProcesso;
	}

	public Long getOrdemPauta() {
		return ordemPauta;
	}

	public void setOrdemPauta(Long ordemPauta) {
		this.ordemPauta = ordemPauta;
	}

	public String getNumeroProcesso() {
		return numeroProcesso;
	}

	public void setNumeroProcesso(String numeroProcesso) {
		this.numeroProcesso = numeroProcesso;
	}

	public String getJuizRelator() {
		return juizRelator;
	}

	public void setJuizRelator(String juizRelator) {
		this.juizRelator = juizRelator;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAdvogadoNome() {
		return advogadoNome;
	}

	public void setAdvogadoNome(String advogadoNome) {
		this.advogadoNome = advogadoNome;
	}

	public String getAdvogadoCodigoOab() {
		return advogadoCodigoOab;
	}

	public void setAdvogadoCodigoOab(String advogadoCodigoOab) {
		this.advogadoCodigoOab = advogadoCodigoOab;
	}

	public String getAdvogadoSituacao() {
		return advogadoSituacao;
	}

	public void setAdvogadoSituacao(String advogadoSituacao) {
		this.advogadoSituacao = advogadoSituacao;
	}

	public String getPartes_processo() {
		return partes_processo;
	}

	public void setPartes_processo(String partes_processo) {
		this.partes_processo = partes_processo;
	}

	public String getClasse() {
		return classe;
	}

	public void setClasse(String classe) {
		this.classe = classe;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public ProcessoSustentacaoDTO converterDTO() {
		return new ProcessoSustentacaoDTO(
				this.id,
				this.idSessao,
				this.sessaoData,
				this.sessaoTipo,
				this.idProcesso,
				this.ordemPauta,
				this.numeroProcesso,
				this.juizRelator,
				this.status,
				this.advogadoNome,
				this.advogadoCodigoOab,
				this.advogadoSituacao,
				this.email,
				this.telefone,
				this.partes_processo,
				this.classe
		);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ProcessoSustentacao other = (ProcessoSustentacao) obj;
		return Objects.equals(id, other.id);
	}
}