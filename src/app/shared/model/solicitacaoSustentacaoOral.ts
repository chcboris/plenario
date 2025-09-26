export interface SolicitacaoSustentacaoOral {
    dataSessao: string;
    numeroOrdemPauta: number;
    numeroProcesso: string;
    relator: string;
    nomeParteRepresentada: string;
    nomeAdvogado: string;
    numeroOAB: string;
    telefoneCelular: string;
    email: string;
    comPreferencia: boolean;
    modalidadeSustentacao: 'virtual' | 'presencial';    
}

// export interface SustentacaoOral {
//     dataSessao: string;
//     numeroOrdemPauta: number;
//     numeroProcesso: string;
//     relator: string;
//     nomeParteRepresentada: string;
//     nomeAdvogado: string;
//     numeroOAB: string;
//     telefoneCelular: string;
//     email: string;
//     comPreferencia: boolean;
//     modalidadeSustentacao: 'virtual' | 'presencial';
//         id?: string;
//     status?: 'pendente' | 'aprovado' | 'rejeitado';
//     dataSolicitacao?: string;
//     observacoes?: string;
// }
