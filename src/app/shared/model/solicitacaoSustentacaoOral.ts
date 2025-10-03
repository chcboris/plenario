// export interface SolicitacaoSustentacaoOral {
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
//     validacao: boolean;
// }

export interface SolicitacaoSustentacaoOral {
    // Novos campos de identificação e chave primária (Long/Integer em Java -> number em TS)
    id?: number; // Opcional, pois não estará presente na criação inicial
    idSessao: number;
    idProcesso: number;

    // Campos existentes
    numeroOrdemPauta: number;
    dataSessao: Date; // LocalDate em Java é tipicamente uma string formatada (ex: 'YYYY-MM-DD') em TS
    numeroProcesso: string;
    relator: string;
    nomeParteRepresentada: string;
    nomeAdvogado: string;
    numeroOAB: string;
    telefoneCelular: string;
    email: string;

    // Campo de preferência atualizado de 'comPreferencia' para 'preferencia'
    preferencia: boolean; 
    
    // Campo de modalidade
    modalidadeSustentacao: 'virtual' | 'presencial';
    
    // Campo de validação
    validacao: boolean;
}
