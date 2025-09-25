import { Votante } from "./votante";

export interface Placar {
  tipoVoto: string;
  quantidade: number;
  votantes?: Votante[];   // pode não vir no JSON
  idOJCondutor?: number;  // também opcional
}
