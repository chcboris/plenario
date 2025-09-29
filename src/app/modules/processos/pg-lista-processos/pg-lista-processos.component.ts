import { ChangeDetectionStrategy, Component, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sessao } from '../../../shared/model/sessao';
import { Subscription } from 'rxjs';
import { SessaoService } from '../../../shared/service/sessao.service';
import { ItemListaProcessosComponent } from '../componentes/item-lista-processos/item-lista-processos.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogLoadModuleComponent } from '../../../shared/util/dialog-load-module/dialog-load-module.component';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Processo } from '../../../shared/model/processo';

@Component({
  selector: 'app-pg-lista-processos',
  imports: [ItemListaProcessosComponent, CommonModule, MaterialComponentes, ReactiveFormsModule],
  templateUrl: './pg-lista-processos.component.html',
  styleUrl: './pg-lista-processos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PgListaProcessosComponent {
  readonly panelOpenState = signal(false);
  sessao?: Sessao;
  sessaoSignal = signal<Sessao | undefined>(undefined);
  filtroJulgados: FormControl = new FormControl('1');
  processosFiltrados: Processo[] = [];
  quantidadeJulgados?: number;
  quantidadeNaoJulgados?: number;

  dialogRef?: any;

  mensagemErro: string = '';
  mensagemSucesso: string = '';

  subscriptions: Subscription[] = [];

  constructor(
    private sessaoService: SessaoService,
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      let idSessao: string = params['idSessao'];
      if (idSessao) {
        this.obterSessao(idSessao);
      }
    });

    this.filtroJulgados.valueChanges.subscribe(() => {
      if (this.sessao) {
        if (this.filtroJulgados.value === '1') {
          this.processosFiltrados = this.sessao.processos.filter((p) => p.situacaoJulgamento === 'Julgado');
          this.quantidadeJulgados = this.processosFiltrados.length;
          this.quantidadeNaoJulgados = this.sessao.processos.length - this.quantidadeJulgados;
        } else {
          this.processosFiltrados = this.sessao.processos.filter((p) => p.situacaoJulgamento !== 'Julgado');
          this.quantidadeNaoJulgados = this.processosFiltrados.length;
          this.quantidadeJulgados = this.sessao.processos.length - this.quantidadeNaoJulgados;
        }
      }
    });
  }

  obterSessao(idSessao: string) {
    this.openDialog();
    let subObterSessao: Subscription = this.sessaoService.obterSessaoComProcessos(idSessao)
      .subscribe({
        next: (res) => {
          this.sessao = res;
          this.sessaoSignal.set(this.sessao);

          let dataAtual = new Date();
          dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
          let dataSessao = new Date(this.sessao.data);
          dataSessao.setHours(dataSessao.getHours() + 3);

          if(dataSessao >= dataAtual){
            this.filtroJulgados.setValue('0');
            this.processosFiltrados = this.sessao.processos.filter((p) => p.situacaoJulgamento !== 'Julgado');
          } else {
            this.filtroJulgados.setValue('1');
            this.processosFiltrados = this.sessao.processos.filter((p) => p.situacaoJulgamento === 'Julgado');
          }
          this.closeDialog();
        },
        error: (e) => {
          this.mensagemErro = e.error;
          this.closeDialog();
        },
      });
    this.subscriptions.push(subObterSessao);
  }

  obterClasseTipo() {
    switch (this.sessaoSignal()?.tipoSessaoFormatada) {
      case 'Presencial':
        return {color: '#031ec9'};
      case 'Videoconferência':
        return {color: '#031ec9'};
      case 'Virtual':
        return {color: '#ed2b02'};
      default:
        return {color: 'white'};
    }
  }

  obterComposicao() {
    return `<strong>Composição da sessão:</strong> <i>${this.sessao?.composicao}</i>`;
  }

  obterClasseTamanhoLista() {
    return this.sessao && this.sessao?.composicao.length > 195 ? 'lista-processos-composicao': 'lista-processos';
  }

  openDialog() {
    this.dialogRef = this.dialog.open(DialogLoadModuleComponent, {
      panelClass: 'dialog-load',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
