import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { SolicitaSustentacao } from '../../../shared/model/SolicitaSustentacao';
import { Usuario } from '../../../shared/model/usuario';
import { Criptografia } from '../../../shared/util/criptografia';
import { Router } from '@angular/router';
import { Constantes } from '../../../shared/util/constantes';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { SustentacaoOral } from '../../../shared/model/sustentacaoProcesso';

@Component({
  selector: 'app-pg-lista-trata-processo',
  imports: [CommonModule, MaterialComponentes],
  templateUrl: './pg-lista-trata-processo.component.html',
  styleUrl: './pg-lista-trata-processo.component.css'
})
export class PgListaTrataProcessoComponent implements OnInit, OnDestroy, AfterViewInit {
  
  // Colocando 'dataSessao' como primeira coluna
  // displayedColumns: string[] = ['dataSessao', 'ordemPauta', 'numeroProcesso', 'relator', 'nomeParteRepresentada', 'modalidadeSustentacao', 'status', 'acao'];
  displayedColumns: string[] = ['dataSessao', 'ordemPauta', 'numeroProcesso', 'relator', 'modalidadeSustentacao', 'status', 'acao'];

  // Alterando 'dataSource' para MatTableDataSource
  dataSource = new MatTableDataSource<SolicitaSustentacao>([]);
  usuario?: Usuario;
  subscriptions: Subscription[] = [];

  // ViewChild para MatSort e MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public router: Router, private paginatorIntl: MatPaginatorIntl) {
    // Configurando tradução do paginator para português
    this.paginatorIntl.itemsPerPageLabel = 'Itens por página:';
    this.paginatorIntl.nextPageLabel = 'Próxima página';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primeira página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    this.carregarProcessos();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Adicionando a vinculação do sort e paginator após a visualização ser inicializada
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  carregarUsuarioLogado(): void {
    const usuarioStorage = sessionStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(Criptografia.decode(usuarioStorage));
    }
    
  }

  carregarProcessos(): void {
    // Simulando dados para demonstração - em produção seria uma chamada para o serviço
    //if (!this.usuario?.login) {
      const data: SolicitaSustentacao[] = [
        {
          id: 1,          
          idSessao: 1,
          sessaoData: new Date('2024-01-15'),
          sessaoTipo: 'Virtual',
          idProcesso: 1111,
          ordemPauta: 1,
          numeroProcesso: '0001234-56.2024.6.19.0015',
          juizRelator: 'Des. João Silva',
          status: 0,
          advogadoNome: 'Dr. Maria Oliveira',
          advogadoCodigoOab: '12345/RJ',
          advogadoSituacao: 'at',
        }             
      ];
      this.dataSource.data = data; // Atribui os dados ao MatTableDataSource
    //}
  }

  redirecionarParaSolicitacao(processo: SustentacaoOral): void {
    //this.router.navigate(['/pg-solicitacao-sustentacao', processo.id]);
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

  obterCorModalidade(modalidade: string): string {
    switch (modalidade) {
      case 'virtual':
        return '#ff9800';
      case 'presencial':
        return '#2196f3';
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