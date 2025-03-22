export interface Kit {
    id: string;
    nome: string;
    produtos: {
        produtoId: string;
        quantidade: number;
    }[];
}
