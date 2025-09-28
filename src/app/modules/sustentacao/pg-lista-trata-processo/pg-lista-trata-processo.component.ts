import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { SustentacaoOral } from '../../../shared/model/sustentacaoOral';
import { Usuario } from '../../../shared/model/usuario';
import { Criptografia } from '../../../shared/util/criptografia';
import { Router } from '@angular/router';
import { Constantes } from '../../../shared/util/constantes';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-pg-lista-trata-processo',
  imports: [CommonModule, MaterialComponentes],
  templateUrl: './pg-lista-trata-processo.component.html',
  styleUrl: './pg-lista-trata-processo.component.css'
})
export class PgListaTrataProcessoComponent implements OnInit, OnDestroy, AfterViewInit {
  
  // Colocando 'dataSessao' como primeira coluna
  displayedColumns: string[] = ['dataSessao', 'numeroProcesso', 'relator', 'nomeParteRepresentada', 'modalidadeSustentacao', 'status', 'acao'];
  
  // Alterando 'dataSource' para MatTableDataSource
  dataSource = new MatTableDataSource<SustentacaoOral>([]);
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
      const data: SustentacaoOral[] = [
        {
          id: 1,
          dataSessao: '2024-02-15',
          numeroOrdemPauta: 1,
          numeroProcesso: '0001234-56.2024.6.19.0015',
          relator: 'Des. João Silva',
          nomeParteRepresentada: 'João dos Santos',
          nomeAdvogado: 'Dr. Maria Oliveira',
          numeroOAB: '12345/RJ',
          telefoneCelular: '(21) 99999-9999',
          email: 'maria@advogados.com',
          comPreferencia: true,
          modalidadeSustentacao: 'virtual',
          loginAdvogado: 'chc',
          status: 'pendente',
          dataInclusao: new Date('2024-01-15')
        },
        {
          id: 2,
          dataSessao: '2024-02-20',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0014',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 3,
          dataSessao: '2024-02-13',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0013',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 4,
          dataSessao: '2024-02-12',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0012',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 5,
          dataSessao: '2024-02-11',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0011',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 6,
          dataSessao: '2024-02-10',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0010',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 7,
          dataSessao: '2024-02-09',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0009',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 8,
          dataSessao: '2024-02-08',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0008',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 9,
          dataSessao: '2024-02-07',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0007',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 10,
          dataSessao: '2024-02-20',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0006',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 11,
          dataSessao: '2024-02-20',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0005',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 12,
          dataSessao: '2024-02-20',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0004',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 13,
          dataSessao: '2024-02-20',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0003',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 14,
          dataSessao: '2024-02-20',
          numeroOrdemPauta: 3,
          numeroProcesso: '0002345-67.2024.6.19.0002',
          relator: 'Des. Ana Costa',
          nomeParteRepresentada: 'Empresa XYZ Ltda',
          nomeAdvogado: 'Dr. Carlos Santos',
          numeroOAB: '67890/RJ',
          telefoneCelular: '(21) 88888-8888',
          email: 'carlos@escritorio.com',
          comPreferencia: false,
          modalidadeSustentacao: 'presencial',
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        },
        {
          id: 15,
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
          loginAdvogado: 'chc',
          status: 'aprovado',
          dataInclusao: new Date('2024-01-10')
        }
        // Adicionar mais dados simulados se necessário para testar a paginação
      ];
      this.dataSource.data = data; // Atribui os dados ao MatTableDataSource
    //}
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