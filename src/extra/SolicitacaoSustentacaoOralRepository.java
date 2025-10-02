package br.jus.trerj.plenario_virtual_api.domain.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.jus.trerj.plenario_virtual_api.domain.model.SolicitacaoSustentacaoOral;

@Repository
public interface SolicitacaoSustentacaoOralRepository extends JpaRepository<SolicitacaoSustentacaoOral, Long> {

    // Exemplo de busca: Listar solicitações por data de sessão
    @Query("FROM SolicitacaoSustentacaoOral s WHERE s.dataSessao = :data")
    List<SolicitacaoSustentacaoOral> findByDataSessao(
            @Param("data") LocalDate data);
}