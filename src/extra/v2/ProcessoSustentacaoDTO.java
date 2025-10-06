package br.jus.trerj.plenario_virtual_api.api.dto;

import java.util.Date;

public record ProcessoSustentacaoDTO(
		Long id,
		Long idSessao,
		Date sessaoData,
		String sessaoTipo,
		Long idProcesso,
		Long ordemPauta,
		String numeroProcesso,
		String juizRelator,
		String status,
		String advogadoNome,
		String advogadoCodigoOab,
		String advogadoSituacao,
		String email,
		String telefone,
		String partes_processo,
		String classe
) {
}