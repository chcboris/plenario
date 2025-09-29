import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialComponentes } from '../../../shared/util/material.imports';

import { Constantes } from '../../../shared/util/constantes';
import { AutenticacaoService } from '../../../shared/service/autenticacao.service';
import { Usuario } from '../../../shared/model/usuario';
import { Resposta } from '../../../shared/model/resposta';

@Component({
  selector: 'app-pg-esqueceu-senha',
  imports: [ReactiveFormsModule, CommonModule, MaterialComponentes],
  templateUrl: './pg-esqueceu-senha.component.html',
  styleUrl: './pg-esqueceu-senha.component.css',
})
export class PgEsqueceuSenhaComponent implements OnInit {
  esqueceuSenhaForm!: FormGroup;
  usuario?: Usuario;
  isSubmitted = false;
  isLoading = false;
  dialogRef?: any;
  mensagemResposta?: string;
  mensagemSucesso?: string;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private autenticacaoService: AutenticacaoService,
  ) {}

  ngOnInit(): void {
    this.esqueceuSenhaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  recuperarSenha() {
    if (this.esqueceuSenhaForm.valid) {
      this.isLoading = true;
      let email = this.esqueceuSenhaForm.get('email')?.value;
      this.usuario = {
        login: email,
        senha:'',
        perfis: [],
        tipoUsuario: 1,
        servidor: undefined,
        token: undefined,
        usuarioExterno: undefined,
        primeiroAcesso: this.router.url.includes('primeiro-acesso')
      }

      let subRecuperarSenha: Subscription = this.autenticacaoService.recuperSenha(this.usuario).subscribe({
          next: (res) => {
            let resposta: Resposta = res;
            this.mensagemSucesso = resposta.mensagemSucesso;
            this.isLoading = false;
            setTimeout(() => {
              this.limparMensagens();
              this.router.navigate(['/login']);
            }, 8000);
          },
          error: (e) => {
            this.mensagemResposta = e.error.message;
            this.isLoading = false;
            setTimeout(() => {
              this.limparMensagens();
            }, 8000);
            this.router.navigate([this.activateRoute.snapshot.url[0].path]);
          },
        });
      this.subscriptions.push(subRecuperarSenha);
    }
  }

  voltarAoLogin() {
    this.router.navigate(['/login']);
  }

  reenviarEmail() {
    this.isSubmitted = false;
    this.recuperarSenha();
  }

  isPrimeiroAcesso() {
    return this.activateRoute.snapshot.url[0].path === 'primeiro-acesso';
  }

  limparMensagens() {
    this.mensagemResposta = '';
    this.mensagemSucesso = '';
  }

  fundoLogin() {
    let enderecoFundo = Constantes.imagePath + 'fundo-login2.jpg';
    return {
      'background-image': 'url(' + enderecoFundo + ')',
      width: '100%',
      height: '100%',
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
