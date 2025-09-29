import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialComponentes } from '../../util/material.imports';

import { Usuario } from '../../model/usuario';
import { PerfilAcesso } from '../../model/perfilAcesso';
import { Criptografia } from '../../util/criptografia';

@Component({
  selector: 'app-header',
  imports: [MaterialComponentes],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  usuario?: Usuario;
  perfilAtual?: PerfilAcesso;
  descricaoUsuario?:string;

  isOco?:boolean;

  exibeMenuTotal: boolean = true;

  constructor(
    private router:Router,
  ) { }

  ngAfterContentInit() {
    let user = sessionStorage.getItem('usuario')
    if (user) {
        this.usuario = JSON.parse(Criptografia.decode(user));
        this.descricaoUsuario = this.descricaoUsuarioLogado();

        if (!this.usuario?.perfis || this.usuario.perfis.length <= 0) {
          this.exibeMenuTotal = false;
        } else {
          this.exibeMenuTotal = true;
        }
    }
  }

  descricaoUsuarioLogado(){
    let descricao: string = '';

    if (this.usuario?.tipoUsuario === 0) {
      if (this.usuario && this.usuario.servidor && this.usuario.servidor.nome) {
        let nome:string = (this.usuario.servidor.nome.length <= 25 ? this.usuario.servidor.nome : this.usuario.servidor.login) ?? "";

        if (!this.usuario.perfis || this.usuario.perfis.length <= 0) {
          descricao = `${nome}  - <span class="italico">${this.usuario?.servidor.siglaLotacao} </span>`;
        } else {
          descricao = `${nome}  - <span class="italico">${this.usuario?.perfis[0]?.perfil?.substring(17,this.usuario?.perfis[0]?.perfil.length)} </span>`;
        }
      }
    } else {
      descricao = this.usuario?.usuarioExterno?.nome + '  ( Externo )  ';
    }



    return descricao;
  }

  isLogado(){
    return sessionStorage.getItem('usuario') ? true : false;
  }

  logIn(){
    this.router.navigate(['login']);
  }

  logOut(){
    sessionStorage.removeItem('usuario');
    this.router.navigate(['']);
  }
}
