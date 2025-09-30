import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Constantes } from '../util/constantes';
import { SolicitaSustentacao } from '../model/SolicitaSustentacao';

@Injectable({
  providedIn: 'root'
})
export class SustentacaoService {
  constructor(private http: HttpClient) { }

  obterProcessosAdvogado(oab: string) {
    return this.http.get<SolicitaSustentacao[]>(`${Constantes.endpoint}processos-advogados/oab/${oab}`);
  }

}
