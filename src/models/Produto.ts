export interface Produto {
    id: string;
    nome: string;
    receitaIds: string[];
    quantidadeProduzida: number;
    tipoPreco: string;
    valor: number;
}
