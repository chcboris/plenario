import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { Constantes } from '../../../shared/util/constantes';

@Component({
  selector: 'app-pg-cadastro-usuario-externo',
  imports: [ReactiveFormsModule, CommonModule, MaterialComponentes],
  templateUrl: './pg-cadastro-usuario-externo.component.html',
  styleUrl: './pg-cadastro-usuario-externo.component.css'
})
export class PgCadastroUsuarioExternoComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      cpf: ['', [Validators.required, this.cpfValidator]]
    }, { validators: this.validadorDeSenha });
  }

  // Validador customizado para CPF
  cpfValidator(control: AbstractControl) {
    const cpf = control.value;
    if (!cpf) return null;

    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) {
      return { invalidCpf: true };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return { invalidCpf: true };
    }

    return null;
  }

  // Validador para confirmar se as senhas coincidem
  validadorDeSenha(form: AbstractControl) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  cadastrar() {
    if (this.registerForm.valid) {
      console.log('Register data:', this.registerForm.value);
      // Aqui você implementaria a lógica de cadastro
      alert('Cadastro realizado com sucesso!');
      this.router.navigate(['/login']);
    }
  }

  voltarAoLogin() {
    this.router.navigate(['/login']);
  }

  // Máscara para CPF
  mascaraCPFEntrada(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    event.target.value = value;
    this.registerForm.patchValue({ cpf: value });
  }


  fundoLogin(){
      let enderecoFundo = Constantes.imagePath + 'fundo-login2.jpg';
      return {
        'background-image': 'url(' + enderecoFundo + ')',
        'width': '100%',
        'height': '100%'

      }
  }
}
