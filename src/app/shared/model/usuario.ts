import { PerfilAcesso } from "./perfilAcesso";
import { Servidor } from "./servidor";
import { UsuarioExterno } from "./usuarioExterno";

export interface Usuario {
  login?: string;
  senha?: string;
  confirmaSenha?: string;
  token?: string;
  perfis: PerfilAcesso[];
  servidor?: Servidor;
  tipoUsuario: number; //0 - servidor ou 1 - usuário externo (advogados)
  usuarioExterno?: UsuarioExterno;
  primeiroAcesso?: boolean;
}
