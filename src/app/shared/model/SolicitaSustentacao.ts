export interface SolicitaSustentacao {
    id: number;
    idSessao: number;
    sessaoData: Date;
    sessaoTipo: string;
    idProcesso: number;
    ordemPauta: number;
    numeroProcesso: string;
    juizRelator: string;
    status: number;
    advogadoNome: string;
    advogadoCodigoOab: string;
    advogadoSituacao: string;    
} 