import { DocumentoProcesso } from "./documentoProcesso";
import { ParteAdvogado } from "./parteAdvogado";
import { Voto } from "./voto";
import { VotoConteudo } from "./votoConteudo";

export interface Processo {
  id: number;
  idSessao: number;
  data: Date;
  ordemPauta: number;
  numeroProcesso: string;
  assunto: string;
  origem: string;
  cpfRelator: string;
  juizRelator: string;
  cadeiaRecurso: string;
  processoClasse: string;
  link: string;
  situacaoJulgamento: string;
  proclamacao: string;
  vencedor: string;
  identificacao: string;
  dataInclusao: Date;
  dataAlteracao: Date;
  partesAdvogados: ParteAdvogado[];
  documentos:DocumentoProcesso[];
  votos: Voto[];
  votosConteudo: VotoConteudo[];
}

