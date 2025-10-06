package br.jus.trerj.plenario_virtual_api.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.jus.trerj.plenario_virtual_api.api.dto.ProcessoSustentacaoDTO;
import br.jus.trerj.plenario_virtual_api.api.dto.SolicitaSustentacaoDTO;
import br.jus.trerj.plenario_virtual_api.domain.service.SustentacaoService;

@RestController
@RequestMapping(value = "/sustentacao")
public class SustentacaoController {

	@Autowired
	private SustentacaoService processoAdvogadoService;

//	@GetMapping
//	public ResponseEntity<?> listarTodos() {
//		List<ProcessoAdvogadoDTO> processosAdvogados = this.processoAdvogadoService.listarTodos();
//		return new ResponseEntity<List<ProcessoAdvogadoDTO>>(processosAdvogados, HttpStatus.OK);
//	}
//
//	@GetMapping("/{id}")
//	public ResponseEntity<?> obterPorId(@PathVariable("id") String id) {
//		ProcessoAdvogadoDTO processoAdvogado = this.processoAdvogadoService.obterPorId(Long.valueOf(id));
//		
//		if (processoAdvogado == null) {
//			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//		}
//		
//		return new ResponseEntity<ProcessoAdvogadoDTO>(processoAdvogado, HttpStatus.OK);
//	}
//
//	@GetMapping("/sessao/{id_sessao}")
//	public ResponseEntity<?> listarPorSessao(@PathVariable("id_sessao") String idSessao) {
//		List<ProcessoAdvogadoDTO> processosAdvogados = this.processoAdvogadoService.listarPorSessao(Long.valueOf(idSessao));
//		return new ResponseEntity<List<ProcessoAdvogadoDTO>>(processosAdvogados, HttpStatus.OK);
//	}
//
//	@GetMapping("/sessao/{id_sessao}/processo/{id_processo}")
//	public ResponseEntity<?> listarPorSessaoEProcesso(
//			@PathVariable("id_sessao") String idSessao,
//			@PathVariable("id_processo") String idProcesso) {
//		List<ProcessoAdvogadoDTO> processosAdvogados = this.processoAdvogadoService.listarPorSessaoEProcesso(
//				Long.valueOf(idSessao),
//				Long.valueOf(idProcesso));
//		return new ResponseEntity<List<ProcessoAdvogadoDTO>>(processosAdvogados, HttpStatus.OK);
//	}

	@GetMapping("/lista/processos/oab/{codigo_oab}")
	public ResponseEntity<?> listarPorCodigoOab(@PathVariable("codigo_oab") String codigoOab) {
		List<ProcessoSustentacaoDTO> processosAdvogados = this.processoAdvogadoService.listarProcessosPorCodigoOab(codigoOab);
		return new ResponseEntity<List<ProcessoSustentacaoDTO>>(processosAdvogados, HttpStatus.OK);
	}

	
	@GetMapping("/sessao/processo/{id_sessao}/{id_processo}/{ordemPauta}/{oab}")
	public ResponseEntity<?> buscarProcessoEspecifico(
			@PathVariable("id_sessao") String idSessao,
			@PathVariable("id_processo") String idProcesso,
			@PathVariable("ordemPauta") String ordemPauta,
			@PathVariable("oab") String oab) {
		SolicitaSustentacaoDTO processosAdvogados = this.processoAdvogadoService.buscarProcessoEspecifico(
				Long.valueOf(idSessao),
				Long.valueOf(idProcesso),
				Long.valueOf(ordemPauta),
				oab);
		return new ResponseEntity<SolicitaSustentacaoDTO>(processosAdvogados, HttpStatus.OK);
	}	
	
//	@GetMapping("/processo/{numero_processo}")
//	public ResponseEntity<?> listarPorNumeroProcesso(@PathVariable("numero_processo") String numeroProcesso) {
//		List<ProcessoAdvogadoDTO> processosAdvogados = this.processoAdvogadoService.listarPorNumeroProcesso(numeroProcesso);
//		return new ResponseEntity<List<ProcessoAdvogadoDTO>>(processosAdvogados, HttpStatus.OK);
//	}
}