import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

// Material Design imports
// import { MatCardModule } from '@angular/material/card';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { CommonModule } from '@angular/common';

import { MaterialComponentes } from '../../../shared/util/material.imports';

// Models
import { SolicitacaoSustentacaoOral } from '../../../shared/model/solicitacaoSustentacaoOral';
import { Usuario } from '../../../shared/model/usuario';

// Utils
import { Criptografia } from '../../../shared/util/criptografia';
import { Constantes } from '../../../shared/util/constantes';
import { UsuarioExterno } from '../../../shared/model/usuarioExterno';
import { SustentacaoService } from '../../../shared/service/sustentacao.service';
import { SolicitaSustentacao } from '../../../shared/model/SolicitaSustentacao';
import { DialogLoadModuleComponent } from '../../../shared/util/dialog-load-module/dialog-load-module.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pg-solicitacao-sustentacao',
  imports: [
    // CommonModule,
    // ReactiveFormsModule,
    // MatCardModule,
    // MatTabsModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatButtonModule,
    // MatIconModule,
    // MatRadioModule,
    // MatSnackBarModule,
    // MatSlideToggleModule
  ],
  templateUrl: './pg-solicitacao-sustentacao.component.html',
  styleUrl: './pg-solicitacao-sustentacao.component.css'
})
export class PgSolicitacaoSustentacaoComponent implements OnInit, OnDestroy {
  
  selectedTabIndex = 0;
  solicitacaoForm: FormGroup;
  usuario?: Usuario;
  processoId?: number;
  subscriptions: Subscription[] = [];
  mensagem?: { tipo: 'success' | 'error', texto: string };
  
 dialogRef?: any;

  // Dados simulados para o formulário
  // dadosProcesso: SolicitacaoSustentacaoOral[] = [
  //   {
  //     idSessao: 1,
  //     idProcesso: 2,
  
  //     dataSessao: new Date,
  //     numeroOrdemPauta: 1,
  //     numeroProcesso: '0001234-56.2024.6.19.0001',
  //     relator: 'Des. João Silva',
  //     nomeParteRepresentada: 'João dos Santos, João dos Santos JR, João dos Santos Neto, João dos Santos Bisneto',
  //     nomeAdvogado: 'Dr. Maria Oliveira',
  //     numeroOAB: '12345/RJ',
  //     telefoneCelular: '(21) 99999-9999',
  //     email: 'maria@advogados.com',
  //     preferencia: true,
  //     modalidadeSustentacao: 'virtual',
  //     validacao: false
  //   }
  // ];
   

  textoBaseLegal = `  
    <p>Os pedidos de sustentação oral no TRE/RJ deverão obedecer aos procedimentos abaixo, conforme a modalidade da sessão de julgamento:</p>
    
    <h4>1 - PLENÁRIO VIRTUAL</h4>
    <p>Solicitação na forma do art. 12-A, §§ 1º e 2º da Resolução TRE/RJ nº 1.223/2022, reproduzido abaixo:</p>
    
    <p><strong>Art. 12-A.</strong> Nas hipóteses de cabimento de sustentação oral, os advogados e demais habilitados poderão encaminhar as respectivas sustentações em áudio e/ou vídeo, por meio eletrônico, após a publicação da pauta e até 48 (quarenta e oito) horas antes de iniciado o julgamento em Plenário Virtual.</p>
    
    <p><strong>§1º</strong> Enquanto não implementada ferramenta específica para envio e recebimento de sustentação oral, para fins de sua disponibilização no próprio sistema de votação, os respectivos arquivos, em formato áudio e/ou vídeo, poderão ser juntados aos autos do processo, cabendo ao interessado observar as especificações técnicas admitidas pelo Sistema PJe.</p>
    
    <p><strong>§2º</strong> O advogado e o procurador firmarão termo de declaração de que se encontram devidamente habilitados nos autos e de responsabilidade pelo conteúdo do arquivo enviado.</p>
    
    <h4>2 - VIDEOCONFERÊNCIA E TELEPRESENCIAIS</h4>
    <p>Solicitação na forma do §3º do Art. 15 da Resolução TRE/RJ nº 1.223/2022.</p>
  `;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private sustentacaoService: SustentacaoService,
    private dialog: MatDialog
  ) {
    this.solicitacaoForm = this.fb.group({
      dataSessao: ['', Validators.required],
      numeroOrdemPauta: ['', Validators.required],
      numeroProcesso: ['', Validators.required],
      relator: ['', Validators.required],
      nomeParteRepresentada: ['', Validators.required],
      nomeAdvogado: ['', Validators.required],
      numeroOAB: ['', Validators.required],
      telefoneCelular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      comPreferencia: ['', Validators.required],
      modalidadeSustentacao: ['', Validators.required],
      validacao: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    const idSessao = Number(this.route.snapshot.paramMap.get('idSessao'));
    const idProcesso = Number(this.route.snapshot.paramMap.get('idProcesso'));
    const ordemPauta = Number(this.route.snapshot.paramMap.get('ordemPauta'));

    if (idSessao && idProcesso && ordemPauta && this.usuario?.usuarioExterno?.oab) {
      this.carregarProcessoEspecifico(idSessao, idProcesso, ordemPauta);
    } 
 }

  carregarUsuarioLogado(): void {
    const usuarioStorage = sessionStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(Criptografia.decode(usuarioStorage));
    }
  }

  // Novo método para carregar processo específico
carregarProcessoEspecifico(idSessao: number, idProcesso: number, ordemPauta: number): void {
  if (!this.usuario?.usuarioExterno?.oab) {
    console.error('Usuário não encontrado(a)');
    return;
  }

  const subCarregarProcesso: Subscription = this.sustentacaoService
    .obterProcessoEspecifico(idSessao, idProcesso, ordemPauta, this.usuario.usuarioExterno.oab)
    .subscribe({
      next: (processo: SolicitaSustentacao) => {
        // Preencher o formulário com os dados do processo
        this.preencherFormulario(processo);
      },
      error: (e) => {
        console.error('Erro ao carregar o processo:', e);
        this.mensagem = {
          tipo: 'error',
          texto: 'Erro ao carregar dados do processo.'
        };
      }
    });
    
  this.subscriptions.push(subCarregarProcesso);
}


private preencherFormulario(processo: SolicitaSustentacao): void {
   // Converter data ISO para formato YYYY-MM-DD
   let dataSessaoFormatada = '';
   if (processo.sessaoData) {
     const data = new Date(processo.sessaoData);
     dataSessaoFormatada = data.toISOString().split('T')[0];
   }
  
  const dadosFormulario = {
    dataSessao: dataSessaoFormatada,
    numeroOrdemPauta: processo.ordemPauta || '',
    numeroProcesso: processo.numeroProcesso || '',
    relator: processo.juizRelator || '',
    nomeParteRepresentada: processo.partes_processo,
    nomeAdvogado: processo.advogadoNome, // this.usuario?.usuarioExterno?.nome || '',
    numeroOAB: processo.advogadoCodigoOab, // this.usuario?.usuarioExterno?.oab || '',
    telefoneCelular: processo.telefone, // this.usuario?.usuarioExterno?.telefone || '',
    email: processo.email, // this.usuario?.usuarioExterno?.email || '',
    comPreferencia: null,
    modalidadeSustentacao: null,
    validacao: false
  };

  this.solicitacaoForm.patchValue(dadosFormulario);
}

onTabChange(index: number): void {
    this.selectedTabIndex = index;
}

voltar(): void {
  this.router.navigate(['/pg-lista-trata-processo']);
}

fundoLogin() {
  let enderecoFundo = Constantes.imagePath + 'fundo-login2.jpg';
  return {
    'background-image': 'url(' + enderecoFundo + ')',
    'width': '100%',
    'height': '100%'
  }
}

  // solicitar(): void {
  //   if (this.solicitacaoForm.valid) {
  //     const formData = this.solicitacaoForm.value;
      
  //     // Simulando envio da solicitação
  //     console.log('Dados da solicitação:', formData);
      
  //     // Exibir mensagem de sucesso
  //     this.mensagem = {
  //       tipo: 'success',
  //       texto: 'Solicitação de sustentação oral enviada com sucesso!'
  //     };
      
  //     // Rolar para o topo para ver a mensagem
  //     const tabContent = document.querySelector('.tab-content');
  //     if (tabContent) {
  //       tabContent.scrollTop = 0;
  //     }
      
  //     // Remover mensagem após 3 segundos
  //     setTimeout(() => {
  //       this.mensagem = undefined;
  //     }, 3000);
      
  //     // Redirecionar para a lista após 3 segundos
  //     setTimeout(() => {
  //       this.router.navigate(['/pg-lista-trata-processo']);
  //     }, 3000);
  //   } else {
  //     // Exibir mensagem de erro
  //     this.mensagem = {
  //       tipo: 'error',
  //       texto: 'Por favor, preencha todos os campos obrigatórios e aceite a declaração de validação.'
  //     };
      
  //     // Rolar para o topo para ver a mensagem
  //     const tabContent = document.querySelector('.tab-content');
  //     if (tabContent) {
  //       tabContent.scrollTop = 0;
  //     }
      
  //     // Remover mensagem após 3 segundos
  //     setTimeout(() => {
  //       this.mensagem = undefined;
  //     }, 3000);
  //   }
  // }

montarObjetoSolicitacao(): SolicitacaoSustentacaoOral {
  const formValue = this.solicitacaoForm.value;

  const idSessao = Number(this.route.snapshot.paramMap.get('idSessao'));
  const idProcesso = Number(this.route.snapshot.paramMap.get('idProcesso'));
  const ordemPauta = Number(this.route.snapshot.paramMap.get('ordemPauta'));

  const solicitacao: SolicitacaoSustentacaoOral = {
      // Campos de Sessão/Processo
      idSessao: idSessao, // Assumindo que este campo foi adicionado ao formulário
      idProcesso: idProcesso, // Assumindo que este campo foi adicionado ao formulário
      numeroOrdemPauta: ordemPauta,
      dataSessao: formValue.dataSessao,
      numeroProcesso: formValue.numeroProcesso,
      
      // Campos do Advogado/Parte
      relator: formValue.relator,
      nomeParteRepresentada: formValue.nomeParteRepresentada,
      nomeAdvogado: formValue.nomeAdvogado,
      numeroOAB: formValue.numeroOAB,
      telefoneCelular: formValue.telefoneCelular,
      email: formValue.email,
      
      // Campos de Opções
      preferencia: formValue.preferencia, // Nome atualizado na interface/modelo
      modalidadeSustentacao: formValue.modalidadeSustentacao,
      validacao: formValue.validacao
  };

  return solicitacao;
}

    // salvar(){
    //   this.openDialog();

    //   this.ocorrenciaAtualizacao = this.formOcorrencia.getRawValue();

    //   if (this.usuario && this.usuario.login && this.ocorrenciaAtualizacao) {
    //     this.ocorrenciaAtualizacao.loginAlteracao = this.usuario?.login;
    //     this.ocorrenciaAtualizacao.idOcorrencia = this.ocorrencia?.id;
    //   }

    //   if (this.ocorrenciaAtualizacao) {
    //       let subSalvar = this.ocorrenciaService.atualizar(this.ocorrenciaAtualizacao).subscribe({
    //         next: (res) => {
    //             this.ocorrencia = res;
    //             this.formOcorrencia.patchValue(this.ocorrencia);
    //             this.mensagemSucesso = 'Ocorrência atualizada com sucesso';

    //             this.obterFormaContato();
    //             this.obterStatusOcorrencia();
    //             this.classeStatusOcorrencia();

    //             setTimeout(() => {
    //               this.limparMensagens();
    //             }, 8000);
    //             this.closeDialog();
    //           },
    //           error: (e) => {
    //             this.mensagemErro = e.error;
    //             setTimeout(() => {
    //               this.limparMensagens();
    //             }, 8000);
    //             this.closeDialog();
    //           }
    //       });
    //       this.subscriptions.push(subSalvar);
    //     }
    // }

  solicitar(): void {
    if (this.solicitacaoForm.valid) {
      //const formData = this.solicitacaoForm.value;
      
      this.openDialog();

      let solicatacao: SolicitacaoSustentacaoOral = this.montarObjetoSolicitacao();

      if (solicatacao) {

         let subSalvar = this.sustentacaoService.salvar(solicatacao).subscribe({
            next: (res) => {
                solicatacao = res;
                this.mensagem = {
                  tipo: 'success',
                  texto: 'Solicitação de sustentação oral enviada com sucesso!'
                };

                // Rolar para o topo para ver a mensagem
                const tabContent = document.querySelector('.tab-content');
                if (tabContent) {
                  tabContent.scrollTop = 0;
                }
                
                // Remover mensagem após 3 segundos
                setTimeout(() => {
                  this.mensagem = undefined;
                }, 3000);

                this.closeDialog();
              },
              error: (e) => {
                //this.mensagemErro = e.error;
      this.mensagem = {
        tipo: 'error',
        texto: 'Por favor, preencha todos os campos obrigatórios e aceite a declaração de validação.'
      };
      
      // Rolar para o topo para ver a mensagem
      const tabContent = document.querySelector('.tab-content');
      if (tabContent) {
        tabContent.scrollTop = 0;
      }
      
      // Remover mensagem após 3 segundos
      setTimeout(() => {
        this.mensagem = undefined;
      }, 3000);
              }
          });
          this.subscriptions.push(subSalvar);
        }
      // Simulando envio da solicitação
      //console.log('Dados da solicitação:', formData);
      
      // Exibir mensagem de sucesso
      this.mensagem = {
        tipo: 'success',
        texto: 'Solicitação de sustentação oral enviada com sucesso!'
      };
  }
  }

  openDialog() {
    this.dialogRef = this.dialog.open(DialogLoadModuleComponent, {
      panelClass: 'dialog-load',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}

}