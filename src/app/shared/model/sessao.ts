import { Processo } from "./processo";

export interface Sessao {
   id:number;
   data: Date;
   hora: string;
   descricao: string;
   tipoSessao: string;
   dataFim: Date;
   horaFim:string;
   composicao: string;
   dataInclusao: Date;
   dataAlteracao: Date;
   quantidadeProcessos: number;
   tipoSessaoFormatada: string;
   processos: Processo[];
  }
