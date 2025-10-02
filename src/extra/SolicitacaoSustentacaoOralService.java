package br.jus.trerj.plenario_virtual_api.domain.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.jus.trerj.plenario_virtual_api.api.dto.SolicitacaoSustentacaoOralDTO;
import br.jus.trerj.plenario_virtual_api.domain.model.SolicitacaoSustentacaoOral;
import br.jus.trerj.plenario_virtual_api.domain.repository.SolicitacaoSustentacaoOralRepository;

@Service
public class SolicitacaoSustentacaoOralService {
	
	@Autowired
	private SolicitacaoSustentacaoOralRepository solicitacaoSustentacaoOralRepository;
	
	@Transactional
	public SolicitacaoSustentacaoOralDTO salvar(SolicitacaoSustentacaoOralDTO dto) {
		SolicitacaoSustentacaoOral model = toModel(dto);
		
		// Lógica de auditoria/criação
		model.setDataInclusao(LocalDateTime.now());
		model.setValidacao(false); // Assume que inicialmente a validação é false
		
		model = this.solicitacaoSustentacaoOralRepository.save(model);
		
		return model.converterDTO();
	}
	
	public List<SolicitacaoSustentacaoOralDTO> listarTodas() {
		return this.solicitacaoSustentacaoOralRepository.findAll()
				.stream()
				.map(SolicitacaoSustentacaoOral::converterDTO)
				.collect(Collectors.toList());
	}
	
	// Método auxiliar para conversão de DTO para Model (necessário para salvar)
	private SolicitacaoSustentacaoOral toModel(SolicitacaoSustentacaoOralDTO dto) {
		SolicitacaoSustentacaoOral model = new SolicitacaoSustentacaoOral();
		model.setId(dto.id()); // Pode ser null se for uma nova entidade
		model.setDataSessao(dto.dataSessao());
		model.setNumeroOrdemPauta(dto.numeroOrdemPauta());
		model.setNumeroProcesso(dto.numeroProcesso());
		model.setRelator(dto.relator());
		model.setNomeParteRepresentada(dto.nomeParteRepresentada());
		model.setNomeAdvogado(dto.nomeAdvogado());
		model.setNumeroOAB(dto.numeroOAB());
		model.setTelefoneCelular(dto.telefoneCelular());
		model.setEmail(dto.email());
		model.setComPreferencia(dto.comPreferencia());
		model.setModalidadeSustentacao(dto.modalidadeSustentacao());
		model.setValidacao(dto.validacao());
		
		// dataInclusao/dataAlteracao será definido no service
		
		return model;
	}
}