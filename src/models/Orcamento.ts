import { Produto } from "./Produto";

export interface Orcamento {
  id: string;
  data: string;
  nomeCliente: string;
  cnpjCliente?: string;
  descricao: string;
  valorTotal: number;
  dadosEmpresa: {
    nome: string;
    cnpj: string;
    logoBase64?: string;
  };
  formaPagamento: string;
  produtos: ProdutoOrcamento[];
  desconto: number;
  total: number;
}

export interface ProdutoOrcamento { produto: Produto; quantidade: number }
