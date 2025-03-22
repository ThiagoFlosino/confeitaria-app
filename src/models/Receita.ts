export interface IngredienteReceita {
  nome: String; 
  itemId: string;
  quantidade: number;
  unidade: string;
}

export interface Receita {
  id: string;
  nome: string;
  descricao: string;
  ingredientes: IngredienteReceita[];
  custoProdução?: number;
  precoSugerido?: number;
  quantidadeProduzida: number;
}