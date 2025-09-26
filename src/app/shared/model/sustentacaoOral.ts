export interface SustentacaoOral {
    id: number;
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
    loginAdvogado: string; // Campo para vincular ao usuário logado
    status: 'pendente' | 'aprovado' | 'rejeitado';
    dataInclusao: Date;
}