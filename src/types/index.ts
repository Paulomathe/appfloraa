export interface Produto {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
  estoque: number;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
}

export interface ItemVenda {
  data: any; // <-- NÃO EXISTE NA TABELA
  id: string; // <-- NÃO ENVIE NO INSERT, é gerado pelo banco
  produto_id?: string;
  servico_id?: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Venda {
  error: boolean;
  id: string;
  cliente: string;
  vendedor: string;
  valor: number;
  data: string;
  observacoes?: string;
  itens: ItemVenda[];
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
}

export interface Vendedor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  comissao: string;
}