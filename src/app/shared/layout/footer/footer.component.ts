import { Component } from '@angular/core';

import { Constantes } from '../../util/constantes';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  version: string = Constantes.versaoAtual; // + environment.build;
  ambiente: string = environment.ambiente;
}
