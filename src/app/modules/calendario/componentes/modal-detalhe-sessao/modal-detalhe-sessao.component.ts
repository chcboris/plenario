import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { MaterialComponentes } from '../../../../shared/util/material.imports';
import { Sessao } from '../../../../shared/model/sessao';

@Component({
  selector: 'app-modal-detalhe-sessao',
  imports: [MaterialComponentes],
  templateUrl: './modal-detalhe-sessao.component.html',
  styleUrl: './modal-detalhe-sessao.component.css'
})
export class ModalDetalheSessaoComponent implements OnInit{

  sessao?:Sessao;

  constructor(
    public dialogRefDetalhe: MatDialogRef<ModalDetalheSessaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ){}

  ngOnInit(): void {
    this.sessao = this.data.sessao;
  }

  visualizarProcessos(){
    this.dialogRefDetalhe.close();

    let rota = 'lista-processos/' + this.sessao?.id;

    this.router.navigate([rota]);

  }
}
