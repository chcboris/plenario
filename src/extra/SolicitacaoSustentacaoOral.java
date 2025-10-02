package br.jus.trerj.plenario_virtual_api.domain.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

import br.jus.trerj.plenario_virtual_api.api.dto.SolicitacaoSustentacaoOralDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(schema = "plenario_virtual", name = "solicitacoes_sustentacao_oral")
public class SolicitacaoSustentacaoOral implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "data_sessao")
	private LocalDate dataSessao;

	@Column(name = "numero_ordem_pauta")
	private Integer numeroOrdemPauta;

	@Column(name = "numero_processo")
	private String numeroProcesso;

	@Column(name = "relator")
	private String relator;

	@Column(name = "nome_parte_representada")
	private String nomeParteRepresentada;

	@Column(name = "nome_advogado")
	private String nomeAdvogado;

	@Column(name = "numero_oab")
	private String numeroOAB;

	@Column(name = "telefone_celular")
	private String telefoneCelular;

	@Column(name = "email")
	private String email;

	@Column(name = "com_preferencia")
	private Boolean comPreferencia;

	// O tipo do TypeScript ('virtual' | 'presencial') é mapeado para uma String
	@Column(name = "modalidade_sustentacao")
	private String modalidadeSustentacao;
	
	@Column(name = "validacao")
	private Boolean validacao;
	
	@Column(name = "data_inclusao")
	private LocalDateTime dataInclusao; // Adicionado para rastreamento
	
	@Column(name = "data_alteracao")
	private LocalDateTime dataAlteracao; // Adicionado para rastreamento

	// Construtor padrão
	public SolicitacaoSustentacaoOral() {
	}

	// Getters and Setters (Omissos para brevidade no exemplo, mas devem ser incluídos)

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDataSessao() {
		return dataSessao;
	}

	public void setDataSessao(LocalDate dataSessao) {
		this.dataSessao = dataSessao;
	}

	public Integer getNumeroOrdemPauta() {
		return numeroOrdemPauta;
	}

	public void setNumeroOrdemPauta(Integer numeroOrdemPauta) {
		this.numeroOrdemPauta = numeroOrdemPauta;
	}

	public String getNumeroProcesso() {
		return numeroProcesso;
	}

	public void setNumeroProcesso(String numeroProcesso) {
		this.numeroProcesso = numeroProcesso;
	}

	public String getRelator() {
		return relator;
	}

	public void setRelator(String relator) {
		this.relator = relator;
	}

	public String getNomeParteRepresentada() {
		return nomeParteRepresentada;
	}

	public void setNomeParteRepresentada(String nomeParteRepresentada) {
		this.nomeParteRepresentada = nomeParteRepresentada;
	}

	public String getNomeAdvogado() {
		return nomeAdvogado;
	}

	public void setNomeAdvogado(String nomeAdvogado) {
		this.nomeAdvogado = nomeAdvogado;
	}

	public String getNumeroOAB() {
		return numeroOAB;
	}

	public void setNumeroOAB(String numeroOAB) {
		this.numeroOAB = numeroOAB;
	}

	public String getTelefoneCelular() {
		return telefoneCelular;
	}

	public void setTelefoneCelular(String telefoneCelular) {
		this.telefoneCelular = telefoneCelular;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Boolean getComPreferencia() {
		return comPreferencia;
	}

	public void setComPreferencia(Boolean comPreferencia) {
		this.comPreferencia = comPreferencia;
	}

	public String getModalidadeSustentacao() {
		return modalidadeSustentacao;
	}

	public void setModalidadeSustentacao(String modalidadeSustentacao) {
		this.modalidadeSustentacao = modalidadeSustentacao;
	}

	public Boolean getValidacao() {
		return validacao;
	}

	public void setValidacao(Boolean validacao) {
		this.validacao = validacao;
	}

	public LocalDateTime getDataInclusao() {
		return dataInclusao;
	}

	public void setDataInclusao(LocalDateTime dataInclusao) {
		this.dataInclusao = dataInclusao;
	}

	public LocalDateTime getDataAlteracao() {
		return dataAlteracao;
	}

	public void setDataAlteracao(LocalDateTime dataAlteracao) {
		this.dataAlteracao = dataAlteracao;
	}

	// Método de conversão para DTO (baseado no padrão Sessao.java)
	public SolicitacaoSustentacaoOralDTO converterDTO() {
		return new SolicitacaoSustentacaoOralDTO(
				this.id,
				this.dataSessao,
				this.numeroOrdemPauta,
				this.numeroProcesso,
				this.relator,
				this.nomeParteRepresentada,
				this.nomeAdvogado,
				this.numeroOAB,
				this.telefoneCelular,
				this.email,
				this.comPreferencia,
				this.modalidadeSustentacao,
				this.validacao
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
		SolicitacaoSustentacaoOral other = (SolicitacaoSustentacaoOral) obj;
		return Objects.equals(id, other.id);
	}
	
}