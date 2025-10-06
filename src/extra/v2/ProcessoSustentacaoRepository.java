package br.jus.trerj.plenario_virtual_api.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.jus.trerj.plenario_virtual_api.domain.model.ProcessoSustentacao;
import br.jus.trerj.plenario_virtual_api.domain.model.SolicitaSustentacao;

@Repository
public interface ProcessoSustentacaoRepository extends JpaRepository<ProcessoSustentacao, Long> {

	@Query("FROM SolicitaSustentacao pa WHERE pa.idSessao = :idSessao")
	List<SolicitaSustentacao> buscarPorSessao(@Param("idSessao") Long idSessao);

	@Query("FROM SolicitaSustentacao pa WHERE pa.idSessao = :idSessao AND pa.idProcesso = :idProcesso")
	List<SolicitaSustentacao> buscarPorSessaoEProcesso(
			@Param("idSessao") Long idSessao,
			@Param("idProcesso") Long idProcesso);

	@Query("FROM SolicitaSustentacao pa WHERE pa.numeroProcesso = :numeroProcesso")
	List<SolicitaSustentacao> buscarPorNumeroProcesso(@Param("numeroProcesso") String numeroProcesso);

	/* ----- */
	
	@Query("FROM SolicitaSustentacao pa WHERE pa.advogadoCodigoOab = :codigoOab")
	List<ProcessoSustentacao> buscarPorCodigoOab(@Param("codigoOab") String codigoOab);
	
	@Query("FROM SolicitaSustentacao pa WHERE pa.idSessao = :idSessao AND pa.idProcesso = :idProcesso and "
			+ "pa.ordemPauta = :ordemPauta AND pa.advogadoCodigoOab = :oab")
	ProcessoSustentacao buscarProcessoEspecifico(
			@Param("idSessao") Long idSessao,
			@Param("idProcesso") Long idProcesso,
			@Param("ordemPauta") Long ordemPauta,
			@Param("oab") String oab);
	
}