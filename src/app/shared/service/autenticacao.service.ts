import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constantes } from '../util/constantes';
import { Resposta } from '../model/resposta';

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

