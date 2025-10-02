import { Component, effect, input, signal} from '@angular/core';
import { Processo } from '../../../../shared/model/processo';
import { MaterialComponentes } from '../../../../shared/util/material.imports';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { VotoConteudo } from '../../../../shared/model/votoConteudo';

@Component({
  selector: 'app-item-lista-processos',
  imports: [MaterialComponentes, CommonModule],
  templateUrl: './item-lista-processos.component.html',
  styleUrl: './item-lista-processos.component.css'
})
export class ItemListaProcessosComponent {

  readonly panelOpenState = signal(false);
  abaSelecionada = 6;

  processoSignal = input<Processo>();
  processo?: Processo;
  virtual = input<string>();

  constructor() {
    effect(() => {
      if (this.processoSignal()) {
           this.processo = this.processoSignal();
      }
    });
  }


  onTabChange(event: MatTabChangeEvent) {
    this.abaSelecionada = event.index;
  }

  exibeSustentacaoOral(){
    return this.virtual()?.includes('Virtual');
  }

  redirecionaConsultaTSE() {
    if (this.processo?.link) {
      window.open(this.processo.link, '_blank');
    }

  }

  exibirRelator() : string{
    return this.processo?.juizRelator? this.processo?.juizRelator : '';
  }

  obterDocumento(tipo: string){
    let documento =  this.processo?.documentos.find((d) => d.tipo === tipo);
    return documento?.conteudo;
  }

  obterVotosFormatados(votos: string) {
    return votos.replaceAll(',', '');
  }

  obterOmissos() {
    let omissos =  this.processo?.votos.filter((v) => v.grupoVoto === 'Omissos');
    let omissosFormatado = '';

    omissos?.forEach((o) => omissosFormatado += o.magistrados.replaceAll('<br>','').replaceAll('&#8226;',',') + ', ');
    omissosFormatado = omissosFormatado.substring(2, omissosFormatado.length - 2);

    return omissosFormatado;
  }

  abrirVoto(votoConteudo: VotoConteudo) {
    let htmlVoto = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Voto - ${votoConteudo.magistrado}</title>
        <style>
          body {
            border: 1px solid black;
            padding: 1em;
            font-family: Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        ${votoConteudo.conteudo}
      </body>
    </html>`;
    const blob = new Blob([htmlVoto], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
