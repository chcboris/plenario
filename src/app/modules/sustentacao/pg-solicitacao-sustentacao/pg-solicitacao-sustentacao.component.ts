import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

// Material Design imports
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

// Models
import { SolicitacaoSustentacaoOral } from '../../../shared/model/solicitacaoSustentacaoOral';
import { Usuario } from '../../../shared/model/usuario';

// Utils
import { Criptografia } from '../../../shared/util/criptografia';
import { Constantes } from '../../../shared/util/constantes';

@Component({
  selector: 'app-pg-solicitacao-sustentacao',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSnackBarModule
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
  
  // Dados simulados para o formulário
  dadosProcesso: SolicitacaoSustentacaoOral[] = [
    {
      dataSessao: '2024-02-15',
      numeroOrdemPauta: 1,
      numeroProcesso: '0001234-56.2024.6.19.0001',
      relator: 'Des. João Silva',
      nomeParteRepresentada: 'João dos Santos',
      nomeAdvogado: 'Dr. Maria Oliveira',
      numeroOAB: '12345/RJ',
      telefoneCelular: '(21) 99999-9999',
      email: 'maria@advogados.com',
      comPreferencia: true,
      modalidadeSustentacao: 'virtual'
    }
  ];

  textoBaseLegal = `
    <h3>Sustentação Oral</h3>
    <p>Compartilhar página via e-mail</p>
    <p>Compartilhar pagina via Facebook</p>
    <p>Compartilhar pagina via WhatsApp</p>
    
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
    private snackBar: MatSnackBar
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
      modalidadeSustentacao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    this.route.params.subscribe(params => {
      this.processoId = +params['id'];
      this.carregarDadosProcesso();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  carregarUsuarioLogado(): void {
    const usuarioStorage = sessionStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(Criptografia.decode(usuarioStorage));
    }
  }

  carregarDadosProcesso(): void {
    // Simulando carregamento de dados - em produção seria uma chamada para o serviço
    if (this.processoId && this.dadosProcesso.length > 0) {
      const dados = this.dadosProcesso[0];
      this.solicitacaoForm.patchValue(dados);
    }
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  solicitar(): void {
    if (this.solicitacaoForm.valid) {
      const formData = this.solicitacaoForm.value;
      
      // Simulando envio da solicitação
      console.log('Dados da solicitação:', formData);
      
      // Exibir mensagem de sucesso
      this.snackBar.open('Solicitação de sustentação oral enviada com sucesso!', 'Fechar', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      
      // Redirecionar para a lista após um breve delay
      setTimeout(() => {
        this.router.navigate(['/pg-lista-trata-processo']);
      }, 2000);
    } else {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
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
}