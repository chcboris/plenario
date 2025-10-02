package br.jus.trerj.plenario_virtual_api.api.dto;

import java.util.Date;

public record UsuarioExternoDTO(
		Long id,
		String cpf,
		String nome,
		String email,
		Date ultimaAtualizacao,
		Date revogacaoAcesso,
		String senha,
		String oab
		) {

}
