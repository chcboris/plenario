import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-portal',
  imports: [CommonModule],
  templateUrl: './menu-portal.component.html',
  styleUrls: ['./menu-portal.component.css']
})
export class MenuPortalComponent {

  constructor(private router: Router) { }

  navegarParaDadosPessoais(): void {
    this.router.navigate(['/cadastro-usuario-externo']);
  }

  navegarParaSustentacao(): void {
    this.router.navigate(['/lista-processo-sustentacao']);
  }

  navegarParaUploadArquivos(): void {
    this.router.navigate(['/area-advogado']);
  }
}