export interface UsuarioExterno {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  ultimaAtualizacao: Date;
  revogacaoAcesso: Date;
  senha: string;
  oab: string;
}
