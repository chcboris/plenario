import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constantes } from '../util/constantes';
import { SolicitaSustentacao } from '../model/SolicitaSustentacao';
import { ProcessoSustentacao } from '../model/processoSustentacao';
import { SolicitacaoSustentacaoOral } from '../model/solicitacaoSustentacaoOral';

@Injectable({
  providedIn: 'root'
})
export class SustentacaoService {
  constructor(private http: HttpClient) { }

  obterProcessosAdvogado(oab: string) {
    return this.http.get<SolicitaSustentacao[]>(`${Constantes.endpoint}processos-advogados/oab/${oab}`);
  }

  obterProcessoEspecifico(idSessao: number, idProcesso: number, ordemPauta: number, oab: string): Observable<SolicitaSustentacao> {
    return this.http.get<SolicitaSustentacao>(
      // `${Constantes.endpoint}processos-advogados/sessao?idSessao=${idSessao}&idProcesso=${idProcesso}&ordemPauta=${ordemPauta}&oab=${oab}`
      `${Constantes.endpoint}processos-advogados/sessao/processo/${idSessao}/${idProcesso}/${ordemPauta}/${oab}`
    );
  }

  // ------------------------------------
    obterListaProcessos(oab: string) {
    return this.http.get<ProcessoSustentacao[]>(`${Constantes.endpoint}sustentacao/lista/processos/oab/${oab}`);
  }

    obterProcesso(idSessao: number, idProcesso: number, ordemPauta: number, oab: string): Observable<SolicitaSustentacao> {
    return this.http.get<SolicitaSustentacao>(
      `${Constantes.endpoint}sustentacao/sessao/processo/${idSessao}/${idProcesso}/${ordemPauta}/${oab}`
    );
  }

    salvar(solicitacaoSustentacaoOral: SolicitacaoSustentacaoOral): Observable<SolicitacaoSustentacaoOral> {
    return this.http.post<SolicitacaoSustentacaoOral>(`${Constantes.endpoint}sustentacao/salvar`, solicitacaoSustentacaoOral);
  }

}
