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
import { SustentacaoService } from '../../../shared/service/sustentacao.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogLoadModuleComponent } from '../../../shared/util/dialog-load-module/dialog-load-module.component';
import moment from 'moment';

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
  
  dialogRef?: any;

  mensagemErro: string = '';
  mensagemSucesso: string = '';

  subscriptions: Subscription[] = [];

  // ViewChild para MatSort e MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public router: Router, private paginatorIntl: MatPaginatorIntl, private sustentacaoService: SustentacaoService, private dialog: MatDialog) {
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

  // carregarProcessos(): void {
  //   // Simulando dados para demonstração - em produção seria uma chamada para o serviço
  //   if (!this.usuario?.login) {
  //     const data: SolicitaSustentacao[] = [
  //       {
  //         id: 1,          
  //         idSessao: 1,
  //         sessaoData: new Date('2024-01-15'),
  //         sessaoTipo: 'Virtual',
  //         idProcesso: 1111,
  //         ordemPauta: 1,
  //         numeroProcesso: '0001234-56.2024.6.19.0015',
  //         juizRelator: 'Des. João Silva',
  //         status: 0,
  //         advogadoNome: 'Dr. Maria Oliveira',
  //         advogadoCodigoOab: '12345/RJ',
  //         advogadoSituacao: 'at',
  //       }             
  //     ];
  //     this.dataSource.data = data; // Atribui os dados ao MatTableDataSource
  //   }
  // }

  carregarProcessos(): void {
    
    if (!this.usuario?.login || !this.usuario.usuarioExterno) {
      return;
    }

    this.openDialog();
    let subCarregarProcessos: Subscription = this.sustentacaoService.obterProcessosAdvogado(this.usuario.usuarioExterno.oab)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          this.closeDialog();
        },
        error: (e) => {
          this.mensagemErro = e.error;
          this.closeDialog();
        },
      });
    this.subscriptions.push(subCarregarProcessos);

  }

  // redirecionarParaSolicitacao(processo: SustentacaoOral): void {
  //   //this.router.navigate(['/pg-solicitacao-sustentacao', processo.id]);
  // }

  redirecionarParaSolicitacao(sustenta: SolicitaSustentacao): void {
    this.router.navigate([
      '/solicitacao-sustentacao', 
      sustenta.idSessao, 
      sustenta.idProcesso, 
      sustenta.ordemPauta
    ]);
  }

  obterCorStatus(status: string): string {
    switch (status) {
      case 'Pendente':
        return '#458f4678';
      case 'Autorizada':
        return '#458f4678';
      case 'Recusada':   
        return '#f1090959';  
      default:
        return 'white';
    }
  }

  obterCorModalidade(modalidade: string): string {
    switch (modalidade) {
      case 'virtual':
        return 'salmon';
      case 'presencial':
        return '#1ebff3';// '#2196f3';
      default:
        return '#1ebff3'; //'#0dcaf0';
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

  openDialog() {
    this.dialogRef = this.dialog.open(DialogLoadModuleComponent, {
      panelClass: 'dialog-load',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validaSolicitacao(dataSessao: Date, statusSessao: any): boolean {
    // 1. Verificar se o status da sessão é nulo ou undefined
    const statusENulo = statusSessao === null || statusSessao === undefined;

    if (!statusENulo) {
        // Se o status não for nulo, a primeira condição falha, retorna false.
        return false;
    }

    // 2. Preparar as datas para comparação apenas pela parte do dia (ignorando o tempo).
    // moment().startOf('day') garante que estamos comparando 'hoje à meia-noite'.
    const dataAtualInicioDia = moment().startOf('day');
    
    // moment(dataSessao).startOf('day') garante que estamos comparando a data da sessão à meia-noite dela.
    const dataAlvoInicioDia = moment(dataSessao).startOf('day');

    // 3. Verificar se a data atual é estritamente anterior à data da sessão.
    // isBefore retorna true se a dataAtualInicioDia for anterior a dataAlvoInicioDia.
    const dataAnterior = dataAtualInicioDia.isBefore(dataAlvoInicioDia);

    // Retorna true somente se ambas as condições forem satisfeitas.
    return statusENulo && dataAnterior;
}
}