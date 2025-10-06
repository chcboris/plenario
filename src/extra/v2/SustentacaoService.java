package br.jus.trerj.plenario_virtual_api.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.jus.trerj.plenario_virtual_api.api.dto.ProcessoSustentacaoDTO;
import br.jus.trerj.plenario_virtual_api.api.dto.SolicitaSustentacaoDTO;
import br.jus.trerj.plenario_virtual_api.domain.model.ProcessoSustentacao;
import br.jus.trerj.plenario_virtual_api.domain.model.SolicitaSustentacao;
import br.jus.trerj.plenario_virtual_api.domain.repository.ProcessoSustentacaoRepository;
import br.jus.trerj.plenario_virtual_api.domain.repository.SolicitaSustentacaoRepository;

@Service
public class SustentacaoService {

	@Autowired
	private SolicitaSustentacaoRepository processoAdvogadoRepository;


	
	public List<SolicitaSustentacaoDTO> listarTodos() {
		List<SolicitaSustentacao> processosAdvogados = this.processoAdvogadoRepository.findAll();
		List<SolicitaSustentacaoDTO> processosAdvogadosDTO = new ArrayList<SolicitaSustentacaoDTO>();

		processosAdvogados.forEach((pa) -> {
			SolicitaSustentacaoDTO dto = pa.converterDTO();
			processosAdvogadosDTO.add(dto);
		});

		return processosAdvogadosDTO;
	}

	public SolicitaSustentacaoDTO obterPorId(Long id) {
		SolicitaSustentacao processoAdvogado = this.processoAdvogadoRepository.findById(id).orElse(null);

		if (processoAdvogado == null) {
			return null;
		}

		return processoAdvogado.converterDTO();
	}

	public List<SolicitaSustentacaoDTO> listarPorSessao(Long idSessao) {
		List<SolicitaSustentacao> processosAdvogados = this.processoAdvogadoRepository.buscarPorSessao(idSessao);
		List<SolicitaSustentacaoDTO> processosAdvogadosDTO = new ArrayList<SolicitaSustentacaoDTO>();

		processosAdvogados.forEach((pa) -> {
			SolicitaSustentacaoDTO dto = pa.converterDTO();
			processosAdvogadosDTO.add(dto);
		});

		return processosAdvogadosDTO;
	}

	public List<SolicitaSustentacaoDTO> listarPorSessaoEProcesso(Long idSessao, Long idProcesso) {
		List<SolicitaSustentacao> processosAdvogados = this.processoAdvogadoRepository.buscarPorSessaoEProcesso(idSessao, idProcesso);
		List<SolicitaSustentacaoDTO> processosAdvogadosDTO = new ArrayList<SolicitaSustentacaoDTO>();

		processosAdvogados.forEach((pa) -> {
			SolicitaSustentacaoDTO dto = pa.converterDTO();
			processosAdvogadosDTO.add(dto);
		});

		return processosAdvogadosDTO;
	}

	public List<SolicitaSustentacaoDTO> listarPorNumeroProcesso(String numeroProcesso) {
		List<SolicitaSustentacao> processosAdvogados = this.processoAdvogadoRepository.buscarPorNumeroProcesso(numeroProcesso);
		List<SolicitaSustentacaoDTO> processosAdvogadosDTO = new ArrayList<SolicitaSustentacaoDTO>();

		processosAdvogados.forEach((pa) -> {
			SolicitaSustentacaoDTO dto = pa.converterDTO();
			processosAdvogadosDTO.add(dto);
		});

		return processosAdvogadosDTO;
	}
	
	/* ------- */
	
	@Autowired
	private ProcessoSustentacaoRepository processoSustentacaoRepository;
	
	public List<ProcessoSustentacaoDTO> listarProcessosPorCodigoOab(String codigoOab) {
		List<ProcessoSustentacao> processosAdvogados = this.processoSustentacaoRepository.buscarPorCodigoOab(codigoOab);
		List<ProcessoSustentacaoDTO> processosAdvogadosDTO = new ArrayList<ProcessoSustentacaoDTO>();

		processosAdvogados.forEach((pa) -> {
			ProcessoSustentacaoDTO dto = pa.converterDTO();
			processosAdvogadosDTO.add(dto);
		});

		return processosAdvogadosDTO;
	}
	
	public SolicitaSustentacaoDTO buscarProcessoEspecifico(Long idSessao, Long idProcesso, Long ordemPauta, String oab) {
		SolicitaSustentacao processosAdvogados = this.processoAdvogadoRepository.buscarProcessoEspecifico(idSessao, idProcesso, ordemPauta, oab);
			
		return processosAdvogados.converterDTO();
	}
}