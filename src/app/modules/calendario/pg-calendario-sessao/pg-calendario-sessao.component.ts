import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Subscription } from 'rxjs';
import { Sessao } from '../../../shared/model/sessao';
import { SessaoService } from '../../../shared/service/sessao.service';
import { DialogLoadModuleComponent } from '../../../shared/util/dialog-load-module/dialog-load-module.component';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { ModalDetalheSessaoComponent } from '../componentes/modal-detalhe-sessao/modal-detalhe-sessao.component';
import { Criptografia } from '../../../shared/util/criptografia';


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
    // let dataEvento = sessionStorage.getItem('mesAnoEvento');
    // if (dataEvento) {
    //   dataEvento = Criptografia.decode(dataEvento);
    //   this.dataAtual = new Date(dataEvento.replaceAll('"',''));
    // }
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

    }
  }

  onDatesSet(datas: DatesSetArg) {
    // if(!this.carregandoPagina){
      const mesAtual = datas.view.currentStart.getMonth() + 1;

      if ((this.dataAtual.getMonth() + 1) != mesAtual) {
        this.dataAtual = datas.view.currentStart;
        this.consultarSessoes((this.dataAtual.getMonth() + 1).toString(), this.dataAtual.getFullYear().toString());
      }
    // }
    this.carregandoPagina = false;
  }

  adicionar(sessao: Sessao) {
    // Monta a data/hora do evento
    let eventStart = sessao.data.toString();

    if (sessao.hora) {
      eventStart += 'T' + sessao.hora;
    }

    let corFundo: string = this.obterCorFundo(sessao.tipoSessaoFormatada);
    let corBorda: string = this.obterCorBorda(sessao.tipoSessaoFormatada);

    // Cria novo evento
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

    // Adiciona o evento à lista e atualiza as opções do calendário
    const updatedEvents = [...this.eventsList(), evento];
    this.eventsList.set(updatedEvents);

    this.calendarOptions.update((options) => ({
      ...options,
      events: this.eventsList()
    }));

    // Limpa o formulário
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

  openDialog() {
    this.dialogRef = this.dialog.open(DialogLoadModuleComponent, {
      panelClass: 'dialog-load',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleEventClick(clickInfo: EventClickArg) {
    let dataEventoClicado = clickInfo.event.start?.toISOString();
    let sessaoEscolhida = this.sessoes.find((s) => s.id == Number(clickInfo.event.id));
    if (sessaoEscolhida) {
      this.abrirModalSessao(sessaoEscolhida);
    }

    if (dataEventoClicado) {
      sessionStorage.setItem("mesAnoEvento", Criptografia.encode(JSON.stringify(dataEventoClicado)));
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
  }

  formatEventDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: date.getHours() !== 0 ? '2-digit' : undefined,
      minute: date.getMinutes() !== 0 ? '2-digit' : undefined,
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
