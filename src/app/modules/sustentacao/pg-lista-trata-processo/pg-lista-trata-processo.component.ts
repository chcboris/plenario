import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { SustentacaoOral } from '../../../shared/model/sustentacaoOral';
import { Usuario } from '../../../shared/model/usuario';
import { Criptografia } from '../../../shared/util/criptografia';
import { Router } from '@angular/router';
import { Constantes } from '../../../shared/util/constantes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pg-lista-trata-processo',
  imports: [CommonModule, MaterialComponentes],
  templateUrl: './pg-lista-trata-processo.component.html',
  styleUrl: './pg-lista-trata-processo.component.css'
})
export class PgListaTrataProcessoComponent implements OnInit, OnDestroy {
  
  displayedColumns: string[] = ['numeroProcesso', 'dataSessao', 'relator', 'nomeParteRepresentada', 'modalidadeSustentacao', 'status', 'acao'];
  dataSource: SustentacaoOral[] = [];
  usuario?: Usuario;
  subscriptions: Subscription[] = [];

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    this.carregarProcessos();
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

  carregarProcessos(): void {
    // Simulando dados para demonstração - em produção seria uma chamada para o serviço
    if (this.usuario?.login) {
      this.dataSource = [
        {
          id: 1,
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
          modalidadeSustentacao: 'virtual',
          loginAdvogado: this.usuario.login,
          status: 'pendente',
          dataInclusao: new Date('2024-01-15')
        },
        {
          id: 2,
          dataSessao: '2024-02-20',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0001',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: this.usuario.login,
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        }
      ];
    }
  }

  redirecionarParaSolicitacao(processo: SustentacaoOral): void {
    this.router.navigate(['/pg-solicitacao-sustentacao', processo.id]);
  }

  obterCorStatus(status: string): string {
    switch (status) {
      case 'pendente':
        return '#ff9800';
      case 'aprovado':
        return '#4caf50';
      case 'rejeitado':
        return '#f44336';
      default:
        return '#757575';
    }
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