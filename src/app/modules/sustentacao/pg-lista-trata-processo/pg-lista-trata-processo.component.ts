// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-pg-lista-trata-processo',
//   imports: [],
//   templateUrl: './pg-lista-trata-processo.component.html',
//   styleUrl: './pg-lista-trata-processo.component.css'
// })
// export class PgListaTrataProcessoComponent {

// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialComponentes } from '../../../shared/util/material.imports';
import { Constantes } from '../../../shared/util/constantes';
import { SustentacaoOral } from '../../../shared/models/solicitacaoSustentacaoOral';

@Component({
  selector: 'app-pg-lista-trata-processo',
  standalone: true,
  imports: [CommonModule, MaterialComponentes],
  templateUrl: './pg-lista-trata-processo.component.html',
  styleUrl: './pg-lista-trata-processo.component.css'
})
export class PgListaTrataProcessoComponent implements OnInit {

  processos: SustentacaoOral[] = [];
  displayedColumns: string[] = [
    'numeroProcesso', 
    'dataSessao', 
    'numeroOrdemPauta',
    'relator',
    'nomeParteRepresentada',
    'modalidadeSustentacao',
    'acao'
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarProcessos();
  }

  carregarProcessos() {
    // Recupera dados do usuário logado
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) {
      this.router.navigate(['/login']);
      return;
    }

    const usuario = JSON.parse(usuarioData);
    
    // Simular dados - em um caso real, faria uma chamada para o backend
    // filtrados pelo login do usuário
    this.processos = [
      {
        dataSessao: '2025-01-15',
        numeroOrdemPauta: 1,
        numeroProcesso: '1234567-89.2024.5.01.0001',
        relator: 'Des. João Silva',
        nomeParteRepresentada: 'Empresa ABC Ltda',
        nomeAdvogado: usuario.nome || 'Nome do Advogado',
        numeroOAB: '123456/SP',
        telefoneCelular: '(11) 99999-9999',
        email: usuario.email || 'advogado@email.com',
        comPreferencia: true,
        modalidadeSustentacao: 'virtual'
      },
      {
        dataSessao: '2025-01-20',
        numeroOrdemPauta: 3,
        numeroProcesso: '9876543-21.2024.5.01.0002',
        relator: 'Des. Maria Santos',
        nomeParteRepresentada: 'José da Silva',
        nomeAdvogado: usuario.nome || 'Nome do Advogado',
        numeroOAB: '123456/SP',
        telefoneCelular: '(11) 99999-9999',
        email: usuario.email || 'advogado@email.com',
        comPreferencia: false,
        modalidadeSustentacao: 'presencial'
      },
      {
        dataSessao: '2025-01-25',
        numeroOrdemPauta: 5,
        numeroProcesso: '5555555-55.2024.5.01.0003',
        relator: 'Des. Carlos Oliveira',
        nomeParteRepresentada: 'Indústria XYZ S.A.',
        nomeAdvogado: usuario.nome || 'Nome do Advogado',
        numeroOAB: '123456/SP',
        telefoneCelular: '(11) 99999-9999',
        email: usuario.email || 'advogado@email.com',
        comPreferencia: true,
        modalidadeSustentacao: 'virtual'
      }
    ];
  }

  solicitarSustentacao(processo: SustentacaoOral) {
    // Navega para o componente de solicitação passando os dados do processo
    this.router.navigate(['/solicitacao-sustentacao'], { 
      state: { processo: processo }
    });
  }

  voltarAoMenu() {
    this.router.navigate(['/areaAdvogado']);
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