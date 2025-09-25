export interface Voto {
  id: number;
  idSessao: number;
  idProcesso: number;
  grupoVoto: string;
  tipoVoto: string;
  quantidade: number;
  magistrados: string;
  ordem: number
}
