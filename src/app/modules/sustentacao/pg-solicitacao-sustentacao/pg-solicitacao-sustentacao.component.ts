// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-pg-solicitacao-sustentacao',
//   imports: [],
//   templateUrl: './pg-solicitacao-sustentacao.component.html',
//   styleUrl: './pg-solicitacao-sustentacao.component.css'
// })
// export class PgSolicitacaoSustentacaoComponent {

// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { Constantes } from '../../../shared/util/constantes';
import { SolicitacaoSustentacaoOral } from '../../../shared/model/solicitacaoSustentacaoOral';


@Component({
  selector: 'app-pg-solicitacao-sustentacao',
  imports: [ReactiveFormsModule, CommonModule, MaterialComponentes],
  templateUrl: './pg-solicitacao-sustentacao.component.html',
  styleUrl: './pg-solicitacao-sustentacao.component.css'
})
export class PgSolicitacaoSustentacaoComponent implements OnInit {

  selectedTabIndex = 0;
  processo: any;
  
  // Formulários
  dadosAdvogadoForm: FormGroup;
  solicitacaoForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router
  ) {
    // Recupera dados do processo passados pela navegação
    const navigation = this.router.getCurrentNavigation();
    this.processo = navigation?.extras?.state?.['processo'];

    if (!this.processo) {
      this.router.navigate(['/lista-trata-processo']);
      return;
    }

    // Inicializa formulários
    this.inicializarFormularios();
  }

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  inicializarFormularios() {
    // Formulário de dados do advogado (baseado no PgCadastroUsuarioExternoComponent)
    this.dadosAdvogadoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]], // Email desabilitado
      cpf: ['', [Validators.required, this.cpfValidator]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.validadorDeSenha });

    // Formulário de solicitação de sustentação oral
    this.solicitacaoForm = this.fb.group({
      dataSessao: [{value: '', disabled: true}],
      numeroOrdemPauta: [{value: '', disabled: true}],
      numeroProcesso: [{value: '', disabled: true}],
      relator: [{value: '', disabled: true}],
      nomeParteRepresentada: ['', [Validators.required]],
      nomeAdvogado: [{value: '', disabled: true}],
      numeroOAB: ['', [Validators.required]],
      telefoneCelular: ['', [Validators.required]],
      email: [{value: '', disabled: true}],
      comPreferencia: [false],
      modalidadeSustentacao: ['virtual', [Validators.required]]
    });
  }

  carregarDadosUsuario() {
    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      
      // Carrega dados do advogado
      this.dadosAdvogadoForm.patchValue({
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf || ''
      });

      // Carrega dados do processo e do usuário no formulário de solicitação
      this.solicitacaoForm.patchValue({
        ...this.processo,
        nomeAdvogado: usuario.nome,
        email: usuario.email
      });
    }
  }

  // Validador customizado para CPF
  cpfValidator(control: AbstractControl) {
    const cpf = control.value;
    if (!cpf) return null;

    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
      return { invalidCpf: true };
    }

    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return { invalidCpf: true };
    }

    return null;
  }

  // Validador para confirmar se as senhas coincidem
  validadorDeSenha(form: AbstractControl) {
    const senha = form.get('senha');
    const confirmarSenha = form.get('confirmarSenha');

    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmarSenha?.hasError('passwordMismatch')) {
      delete confirmarSenha.errors!['passwordMismatch'];
      if (Object.keys(confirmarSenha.errors!).length === 0) {
        confirmarSenha.setErrors(null);
      }
    }

    return null;
  }

  // Máscara para CPF
  mascaraCPFEntrada(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    event.target.value = value;
    this.dadosAdvogadoForm.patchValue({ cpf: value });
  }

  // Máscara para telefone
  mascaraTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    event.target.value = value;
    this.solicitacaoForm.patchValue({ telefoneCelular: value });
  }

  salvarDadosAdvogado() {
    if (this.dadosAdvogadoForm.valid) {
      // Atualiza dados do usuário na sessão
      const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
      const dadosAtualizados = { ...usuario, ...this.dadosAdvogadoForm.getRawValue() };
      sessionStorage.setItem('usuario', JSON.stringify(dadosAtualizados));
      
      alert('Dados atualizados com sucesso!');
    }
  }

  enviarSolicitacao() {
    if (this.solicitacaoForm.valid) {
      const solicitacao: SolicitacaoSustentacaoOral = this.solicitacaoForm.getRawValue();
      console.log('Solicitação enviada:', solicitacao);
      
      // Aqui você implementaria o envio para o backend
      alert('Solicitação de sustentação oral enviada com sucesso!');
      this.router.navigate(['/lista-trata-processo']);
    }
  }

  voltarALista() {
    this.router.navigate(['/lista-trata-processo']);
  }

  // Funções para compartilhamento
  compartilharEmail() {
    const subject = 'Sustentação Oral - Processo ' + this.processo?.numeroProcesso;
    const body = `Informações sobre sustentação oral do processo ${this.processo?.numeroProcesso}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  compartilharFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  compartilharWhatsApp() {
    const text = `Sustentação Oral - Processo ${this.processo?.numeroProcesso}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  fundoLogin() {
    let enderecoFundo = Constantes.imagePath + 'fundo-login2.jpg';
    return {
      'background-image': 'url(' + enderecoFundo + ')',
      'width': '100%',
      'height': '100%'
    }
  }
}