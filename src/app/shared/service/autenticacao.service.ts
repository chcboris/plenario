import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../model/usuario';
import { Resposta } from '../model/resposta';
import { Constantes } from '../util/constantes';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(private http: HttpClient) { }

  autenticar(usuario: Usuario): Observable<Usuario> {
     return this.http.post<Usuario>(`${Constantes.endpoint}usuario/autenticar`, usuario);
  }

  recuperSenha(usuario: Usuario): Observable<Resposta> {
     return this.http.post<Resposta>(`${Constantes.endpoint}usuario/recuperarSenha`, usuario);
  }

  validarTokenTrocaSenha(token: string): Observable<Resposta>  {
    return this.http.get<Resposta>(`${Constantes.endpoint}usuario/validarToken/` + token);
  }

  trocarSenha(usuario: Usuario): Observable<Resposta> {
    return this.http.post<Resposta>(`${Constantes.endpoint}usuario/trocarSenha`, usuario);
  }
}

