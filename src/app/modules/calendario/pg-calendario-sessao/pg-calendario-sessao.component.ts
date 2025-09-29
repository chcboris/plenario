import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { Sessao } from '../../../shared/model/sessao';
import { SessaoService } from '../../../shared/service/sessao.service';
import { Criptografia } from '../../../shared/util/criptografia';
import { DialogLoadModuleComponent } from '../../../shared/util/dialog-load-module/dialog-load-module.component';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { ModalDetalheSessaoComponent } from '../componentes/modal-detalhe-sessao/modal-detalhe-sessao.component';

@Component({
  selector: 'app-pg-calendario-sessao',
  imports: [FormsModule, ReactiveFormsModule, FullCalendarModule, MaterialComponentes],
  templateUrl: './pg-calendario-sessao.component.html',
  styleUrl: './pg-calendario-sessao.component.css',
})
export class PgCalendarioSessaoComponent implements OnInit{
  // Signals para gerenciar estado
  currentEvents = signal<EventApi[]>([]);

  // Propriedades para o formulário
  newEventTitle = '';
  newEventDate = '';
  newEventTime = '';
  sessoes: Sessao[] = [];
  dialogRef?: any;
  dialogRefSessao?: any;

  mensagemErro: string = '';
  mensagemSucesso: string = '';

  subscriptions: Subscription[] = [];
  dataAtual = new Date();
  carregandoPagina: boolean =false;

  // Lista de eventos em formato simples para facilitar manipulação
  private eventsList = signal<EventInput[]>([]);

  @ViewChild('calendario') calendario!: FullCalendarComponent;

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    height: 700,
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: this.onDatesSet.bind(this), // aqui captura mudanças de navegação
    events: this.eventsList(),    // Eventos vinculados ao signal
  });

  constructor(
    private sessaoService: SessaoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let mesAnoEventoClicado = sessionStorage.getItem(Criptografia.encode("mesAnoEventoClicado"));
    if (mesAnoEventoClicado) {
      mesAnoEventoClicado = Criptografia.decode(mesAnoEventoClicado).replaceAll('"','');
      this.dataAtual = new Date(mesAnoEventoClicado);
      sessionStorage.removeItem(Criptografia.encode("mesAnoEventoClicado"));
    }

    this.consultarSessoes( (this.dataAtual.getMonth() + 1).toString(), this.dataAtual.getFullYear().toString());
    this.carregandoPagina = true;
  }

  consultarSessoes(mes: string, ano: string) {
    this.openDialog();

    let subBuscarSessoes: Subscription = this.sessaoService
      .buscarSessoesPorMesAno(mes, ano)
      .subscribe({
        next: (res) => {
          this.sessoes = res;
          this.popularCalendario();
          this.carregandoPagina = false;
          this.closeDialog();
        },
        error: (e) => {
          this.mensagemErro = e.error;
          this.closeDialog();
        },
      });
    this.subscriptions.push(subBuscarSessoes);
  }

  popularCalendario() {
    if (this.sessoes && this.sessoes.length > 0) {
      this.eventsList = signal<EventInput[]>([]);

      this.sessoes.forEach((s) => {
        this.adicionar(s);
      });

      let diasDestacados: string[] = [];
      this.sessoes.forEach((s) => {
        diasDestacados.push(s.data.toString());
      });

      this.calendarOptions.update((options) => ({
        ...options,
        dayCellDidMount: (info) => {
          const dateStr = info.date.toISOString().split('T')[0]; // pega a data no formato YYYY-MM-DD

          if (diasDestacados.includes(dateStr)) {
            info.el.style.backgroundColor = 'whitesmoke'; // cor de fundo
          }
        },
      }));

      this.calendario.getApi().gotoDate(this.dataAtual);

    }
  }

  onDatesSet(datas: DatesSetArg) {
    if (!this.carregandoPagina) {
      const mesAtual = datas.view.currentStart.getMonth() + 1;

      if ((this.dataAtual.getMonth() + 1) != mesAtual) {
        this.dataAtual = datas.view.currentStart;
        this.consultarSessoes((this.dataAtual.getMonth() + 1).toString(), this.dataAtual.getFullYear().toString());
      }

    }
    this.carregandoPagina = false;
  }

  adicionar(sessao: Sessao) {
    let eventStart = sessao.data.toString();

    if (sessao.hora) {
      eventStart += 'T' + sessao.hora;
    }

    let corFundo: string = this.obterCorFundo(sessao.tipoSessaoFormatada);
    let corBorda: string = this.obterCorBorda(sessao.tipoSessaoFormatada);

    let quantidadeProcessos = sessao.quantidadeProcessos;
    const evento: EventInput = {
      id: sessao.id.toString(),
      title: sessao.tipoSessaoFormatada + '\n' + quantidadeProcessos + ' processo(s)',
      start: eventStart,
      allDay: true,
      backgroundColor: corFundo,
      borderColor: corBorda,
      textColor: 'white',

    };

    const updatedEvents = [...this.eventsList(), evento];
    this.eventsList.set(updatedEvents);

    this.calendarOptions.update((options) => ({
      ...options,
      events: this.eventsList()
    }));

    this.newEventDate = '';
    this.newEventTime = '';
  }

  obterCorFundo(tipoSessao: string) {
    switch (tipoSessao) {
      case 'Presencial':
        return '#1ebff3';
      case 'Videoconferência':
        return '#1ebff3';
      case 'Virtual':
        return 'salmon';
      default :
        return 'white';

    }
  }

  obterCorBorda(tipoSessao: string) {
    switch (tipoSessao) {
      case 'Presencial':
        return '#1ebff3';
      case 'Videoconferência':
        return '#1ebff3';
      case 'Virtual':
          return 'salmon';
      default :
        return 'white';

    }
  }

  abrirModalSessao(sessao:Sessao) {
    this.dialogRefSessao = this.dialog.open(ModalDetalheSessaoComponent, {
      panelClass: 'dialog-load',
      width: '500px',
      height: '246px',
      maxWidth: '600px',
      data: { sessao: sessao }
    });

  }


  handleEventClick(clickInfo: EventClickArg) {
    let dataEventoClicado = clickInfo.event.start?.toISOString();
    let sessaoEscolhida = this.sessoes.find((s) => s.id == Number(clickInfo.event.id));
    if (sessaoEscolhida) {
      this.abrirModalSessao(sessaoEscolhida);
    }

    if (dataEventoClicado) {
      sessionStorage.setItem(Criptografia.encode("mesAnoEventoClicado"), Criptografia.encode(JSON.stringify(dataEventoClicado)));
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
