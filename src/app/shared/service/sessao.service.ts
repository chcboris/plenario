import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Sessao } from '../model/sessao';
import { Constantes } from '../util/constantes';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {
  constructor(private http: HttpClient) { }

  buscarSessoesPorMesAno(mes:string, ano: string): Observable<Sessao[]> {
    return this.http.get<Sessao[]>(`${Constantes.endpoint}sessoes/sessoesNoMesAno/${mes}/${ano}`);
  }

  obterSessaoComProcessos(idSessao: string) {
    return this.http.get<Sessao>(`${Constantes.endpoint}sessoes/sessao/${idSessao}`);
  }

}
