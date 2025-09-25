import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { HeaderComponent } from './shared/layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FullCalendarModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'plenario-virtual';
  rotasSemHeaderFooter = ['/login', '/esqueceu-senha', '/primeiro-acesso', '/troca-senha'];

  constructor(
    private router: Router,
  ){}

  exibeHeaderFooter(): boolean{
    let urlAtivaSemParametros = this.router.url.includes('?') ? this.router.url.split('?')[0] : this.router.url;
    return !this.rotasSemHeaderFooter.includes(urlAtivaSemParametros);
  }
}
