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