import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DialogLoadModuleComponent } from '../../../shared/util/dialog-load-module/dialog-load-module.component';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { Constantes } from '../../../shared/util/constantes';
import { Usuario } from '../../../shared/model/usuario';
import { AutenticacaoService } from '../../../shared/service/autenticacao.service';
import { Criptografia } from '../../../shared/util/criptografia';

@Component({
  selector: 'app-pg-login',
  imports: [MaterialComponentes, FormsModule, ReactiveFormsModule],
  templateUrl: './pg-login.component.html',
  styleUrl: './pg-login.component.css'
})
export class PgLoginComponent {

  loginValido: boolean = true;
  formUsuario!: FormGroup;
  usuario?: Usuario;
  mensagemResposta?: string;
  mensagemSucesso?: string;
  subscriptions: Subscription[] = [];
  dialogRef?: any;
  versaoAtual = Constantes.versaoAtual;

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private dialog: MatDialog,
    private autenticacaoService: AutenticacaoService ) {}

  ngOnInit(): void {
    this.createFormLogin();
  }

  createFormLogin() {
    this.formUsuario = this.fb.group({
      login: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

   autenticar() {
     this.openDialog();
     let login:string = this.formUsuario.value.login;
     let tipoUsuario: number = login.includes("@") ? 1 : 0;

     this.usuario = {
      login: tipoUsuario === 0 ? login.toUpperCase() : login,
      senha: this.formUsuario.value.senha,
      token:'',
      perfis: [],
      tipoUsuario: tipoUsuario,
    }

    let subAutenticar:Subscription = this.autenticacaoService.autenticar(this.usuario).subscribe({
      next: (res) => {
        this.usuario = res;

        sessionStorage.setItem("usuario", Criptografia.encode(JSON.stringify(this.usuario)));
        this.closeDialog();

        if (!this.usuario.perfis || this.usuario.perfis.length <= 0) {
          this.router.navigate(['MenuPortalComponent']);
        } else {
          this.router.navigate(['areaAdvogado']);
        }
      },
      error: (e) => {
        this.mensagemResposta = e.error.message;
        setTimeout(() => {
          this.limparMensagens();
        }, 8000);
        this.router.navigate(['login']);
        this.closeDialog();
      }
    });
    this.subscriptions.push(subAutenticar);

  }

  esqueceuASenha() {
    this.router.navigate(['/esqueceu-senha']);
  }

  cadastrarUsuarioExterno() {
    this.router.navigate(['/primeiro-acesso']);
  }

  fundoLogin(){
    let enderecoFundo = Constantes.imagePath + 'fundo-login2.jpg';
    return {
      'background-image': 'url(' + enderecoFundo + ')',
      'width': '100%',
      'height': '100%'
    }
  }

  limparMensagens() {
    this.mensagemResposta = '';
    this.mensagemSucesso = '';
  }

  openDialog() {
    this.dialogRef = this.dialog.open(DialogLoadModuleComponent, { panelClass: 'dialog-load' });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
