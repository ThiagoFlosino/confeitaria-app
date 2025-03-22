export interface Pedido {
  id: string;
  receitaId: string;
  quantidade: number;
  dataEntrega: string;
  nomeCliente: string;
  observacoes?: string;
  status: 'pendente' | 'concluido' | 'cancelado';
}