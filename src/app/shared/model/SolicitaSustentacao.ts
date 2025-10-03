export interface SolicitaSustentacao {
    id: number;
    idSessao: number;
    sessaoData: Date;
    sessaoTipo: string;
    idProcesso: number;
    ordemPauta: number;
    numeroProcesso: string;
    juizRelator: string;
    status: string;
    advogadoNome: string;
    advogadoCodigoOab: string;
    advogadoSituacao: string;  
    email: String;
    telefone: String;
    partes_processo: string;
    classe: string;  
} 