export interface Votante {
  idOrgaoJulgador: number;
  nomeOrgaoJulgador: string;
  votoPossuiConteudo: boolean;
  acompanhaRelator?: boolean; // opcional, pois não vem sempre
}
