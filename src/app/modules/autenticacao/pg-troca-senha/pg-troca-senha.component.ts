import { Component, ViewChild } from '@angular/core';
import { Usuario } from '../../../shared/model/usuario';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Resposta } from '../../../shared/model/resposta';
import { AutenticacaoService } from '../../../shared/service/autenticacao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { CommonModule } from '@angular/common';
import { Constantes } from '../../../shared/util/constantes';

@Component({
  selector: 'app-pg-troca-senha',
  imports: [ReactiveFormsModule, CommonModule, MaterialComponentes],
  templateUrl: './pg-troca-senha.component.html',
  styleUrl: './pg-troca-senha.component.css'
})
export class PgTrocaSenhaComponent {
  token?:string;
  usuario?: Usuario;
  formTrocarSenha: any = FormGroup;
  mensagemResposta?: string;
  mensagemSucesso?: string;
  subscriptions: Subscription[] = [];

  @ViewChild(FormGroupDirective) myFormTrocarSenha: any;

  constructor(
    private fb: FormBuilder,
    private autenticacaoService:AutenticacaoService,
    private router:Router,
    private activateRoute: ActivatedRoute ) {}

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((params: { [x: string]: string | undefined; }) => {
      this.token = params['token'];
      this.validarToken();
    });

    this.createFormEsqueciSenha();
  }

  validarToken() {
    if (this.token) {
      let subValidarToken:Subscription = this.autenticacaoService.validarTokenTrocaSenha(this.token).subscribe({
        next: (res) => {
          //console.log(res);
        },
        error: (e) => {
          this.mensagemResposta = e.message;
          console.error(e.error);
          this.router.navigate(['']);
        }
      })
      this.subscriptions.push(subValidarToken);
    } else {
      this.router.navigate(['']);
    }
  }


  createFormEsqueciSenha() {
    this.formTrocarSenha = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(8)]],
      repeteSenha:['', Validators.required]
    }, { validators: this.validarSenhasIguais})
  }

  trocarSenha(){
    this.usuario =  this.usuario = {
      login: '',
      senha:'',
      perfis: [],
      tipoUsuario: 1,
      servidor: undefined,
      token: undefined,
      usuarioExterno: undefined,
      primeiroAcesso: this.router.url.includes('primeiro-acesso')
    }
    this.usuario.senha = this.formTrocarSenha.value.novaSenha;
    this.usuario.token = this.token;

    let subTrocarSenha:Subscription = this.autenticacaoService.trocarSenha(this.usuario).subscribe({
      next: (res) => {
        let resposta: Resposta = res;
        if (resposta.mensagemSucesso) {
          this.mensagemSucesso = resposta.mensagemSucesso;
          this.formTrocarSenha.reset();
          this.myFormTrocarSenha.resetForm();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 8000);
        } else {
          this.formTrocarSenha.reset();
          this.myFormTrocarSenha.resetForm();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 12000);
        }
      },
      error: (e) => {
          this.mensagemResposta = e.message;
          this.formTrocarSenha.reset();
          this.myFormTrocarSenha.resetForm();
          setTimeout(() => {
            this.limparMensagens();
          }, 8000);
          console.error(e.error);
      }
    })
    this.subscriptions.push(subTrocarSenha);
  }

  validarSenhasIguais(form: AbstractControl) {
    const password = form.get('novaSenha');
    const confirmPassword = form.get('repeteSenha');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ senhasdiferentes: true });
      } else {
        if (confirmPassword.hasError('senhasdiferentes')) {
          confirmPassword.setErrors(null);
        }
      }
    }

    return null;
  }

  limparMensagens() {
    this.mensagemResposta = '';
    this.mensagemSucesso = '';
  }

  fundoLogin(){
    let enderecoFundo = Constantes.imagePath + 'fundo-login2.jpg';
    return {
      'background-image': 'url(' + enderecoFundo + ')',
      'width': '100%',
      'height': '100%'
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
