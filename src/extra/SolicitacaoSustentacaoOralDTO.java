package br.jus.trerj.plenario_virtual_api.api.dto;

import java.time.LocalDate;

public record SolicitacaoSustentacaoOralDTO(
    Long id,
    LocalDate dataSessao,
    Integer numeroOrdemPauta,
    String numeroProcesso,
    String relator,
    String nomeParteRepresentada,
    String nomeAdvogado,
    String numeroOAB,
    String telefoneCelular,
    String email,
    Boolean comPreferencia,
    String modalidadeSustentacao,
    Boolean validacao
) {
}