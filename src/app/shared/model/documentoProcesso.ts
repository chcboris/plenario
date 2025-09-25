export interface DocumentoProcesso {
  id: string;
  idSessao: number;
  idProcesso: number;
  tipo: string;
  formato: string;
  conteudo: string;
  dataInclusao: Date;
	dataAlteracao: Date;
}
