package br.jus.trerj.plenario_virtual_api.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.jus.trerj.plenario_virtual_api.api.dto.SolicitacaoSustentacaoOralDTO;
import br.jus.trerj.plenario_virtual_api.domain.service.SolicitacaoSustentacaoOralService;

@RestController
@RequestMapping(value="/solicitacoes-sustentacao-oral")
public class SolicitacaoSustentacaoOralController {

	@Autowired
	private SolicitacaoSustentacaoOralService solicitacaoSustentacaoOralService;

	@PostMapping
	public ResponseEntity<SolicitacaoSustentacaoOralDTO> solicitar(@RequestBody SolicitacaoSustentacaoOralDTO dto) {
		SolicitacaoSustentacaoOralDTO novaSolicitacao = this.solicitacaoSustentacaoOralService.salvar(dto);
		
		// Retorna 201 Created para nova criação
		return new ResponseEntity<>(novaSolicitacao, HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<SolicitacaoSustentacaoOralDTO>> listarTodas() {
		List<SolicitacaoSustentacaoOralDTO> lista = this.solicitacaoSustentacaoOralService.listarTodas();
		
		return new ResponseEntity<>(lista, HttpStatus.OK);
	}
}