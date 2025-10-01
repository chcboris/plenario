import { Routes } from '@angular/router';
import { PgCalendarioSessaoComponent } from './modules/calendario/pg-calendario-sessao/pg-calendario-sessao.component';
import { PgListaProcessosComponent } from './modules/processos/pg-lista-processos/pg-lista-processos.component';
import { PgLoginComponent } from './modules/autenticacao/pg-login/pg-login.component';
import { autenticadoGuard } from './shared/guards/autenticado.guard';
import { PgAreaGestorComponent } from './modules/area-logada/pg-area-gestor/pg-area-gestor.component';
import { PgAreaAdvogadoComponent } from './modules/area-logada/pg-area-advogado/pg-area-advogado.component';
import { PgEsqueceuSenhaComponent } from './modules/autenticacao/pg-esqueceu-senha/pg-esqueceu-senha.component';
import { PgTrocaSenhaComponent } from './modules/autenticacao/pg-troca-senha/pg-troca-senha.component';
import { PgListaTrataProcessoComponent } from './modules/sustentacao/pg-lista-trata-processo/pg-lista-trata-processo.component';
import { PgSolicitacaoSustentacaoComponent } from './modules/sustentacao/pg-solicitacao-sustentacao/pg-solicitacao-sustentacao.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PgCalendarioSessaoComponent,
  },
  {
    path: 'lista-processos/:idSessao',
    component: PgListaProcessosComponent
  },
  {
    path: 'login',
    component: PgLoginComponent
  },
  {
    path: 'esqueceu-senha',
    component: PgEsqueceuSenhaComponent
  },
  {
    path: 'primeiro-acesso',
    component: PgEsqueceuSenhaComponent
  },
  {
    path: 'troca-senha',
    component: PgTrocaSenhaComponent
  },
  {
    path: 'areaGestor',
    component: PgAreaGestorComponent,
    canActivate: [autenticadoGuard]
  },
  {
    path: 'areaAdvogado',
    component: PgAreaAdvogadoComponent,
    canActivate: [autenticadoGuard]
  },
  {
    path: 'lista-trata-processo',
    component: PgListaTrataProcessoComponent,
    //canActivate: [autenticadoGuard]
  },
  {
    path: 'solicitacao-sustentacao/:idSessao/:idProcesso/:ordemPauta',
    component: PgSolicitacaoSustentacaoComponent,
    //canActivate: [autenticadoGuard]
  },

];
