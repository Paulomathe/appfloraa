import { supabase } from '@/lib/supabase';
import { Cliente, Vendedor, Venda, Produto, Servico } from '@/types';

// Serviços para Produtos
export const produtoService = {
  async listar() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data as Produto[];
  },

  async buscar(termo: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .ilike('nome', `%${termo}%`)
      .order('nome')
      .limit(10);
    
    if (error) throw error;
    return data as Produto[];
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data: data as Produto, error: null };
  },

  async criar(produto: Omit<Produto, 'id'>) {
    const { data, error } = await supabase
      .from('produtos')
      .insert(produto)
      .select()
      .single();
    
    if (error) throw error;
    return data as Produto;
  },

  async atualizar(id: string, produto: Partial<Produto>) {
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Produto;
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Serviços para Serviços
export const servicoService = {
  async listar() {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data as Servico[];
  },

  async buscar(termo: string) {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .ilike('nome', `%${termo}%`)
      .order('nome')
      .limit(10);
    
    if (error) throw error;
    return data as Servico[];
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data: data as Servico, error: null };
  },

  async criar(servico: Omit<Servico, 'id'>) {
    const { data, error } = await supabase
      .from('servicos')
      .insert(servico)
      .select()
      .single();
    
    if (error) throw error;
    return data as Servico;
  },

  async atualizar(id: string, servico: Partial<Servico>) {
    const { data, error } = await supabase
      .from('servicos')
      .update(servico)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Servico;
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Serviços para Clientes
export const clienteService = {
  async listar() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data as Cliente[];
  },

  async buscar(termo: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .ilike('nome', `%${termo}%`)
      .order('nome')
      .limit(10);
    
    if (error) throw error;
    return data as Cliente[];
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data: data as Cliente, error: null };
  },

  async criar(cliente: Omit<Cliente, 'id'>) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single();
    
    if (error) throw error;
    return data as Cliente;
  },

  async atualizar(id: string, cliente: Partial<Cliente>) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Cliente;
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Serviços para Vendedores
export const vendedorService = {
  async listar() {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data as Vendedor[];
  },

  async buscar(termo: string) {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .ilike('nome', `%${termo}%`)
      .order('nome')
      .limit(10);
    
    if (error) throw error;
    return data as Vendedor[];
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data: data as Vendedor, error: null };
  },

  async criar(vendedor: Omit<Vendedor, 'id'>) {
    const { data, error } = await supabase
      .from('vendedores')
      .insert(vendedor)
      .select()
      .single();
    
    if (error) throw error;
    return data as Vendedor;
  },

  async atualizar(id: string, vendedor: Partial<Vendedor>) {
    const { data, error } = await supabase
      .from('vendedores')
      .update(vendedor)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Vendedor;
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('vendedores')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Serviços para Vendas
export const vendaService = {
  async listar() {
    const { data, error } = await supabase
      .from('vendas')
      .select(`
        *,
        itens:itens_venda(*)
      `)
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data as Venda[];
  },

  async listarVendasDoDia() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('vendas')
      .select(`
        *,
        itens:itens_venda(*)
      `)
      .gte('data', hoje.toISOString())
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data as Venda[];
  },

  async criar(venda: Omit<Venda, 'id'>) {
    // 1. Insere a venda (sem o campo 'itens')
    const { data: vendaData, error: vendaError } = await supabase
      .from('vendas')
      .insert({
        cliente: venda.cliente,
        vendedor: venda.vendedor,
        valor: venda.valor,
        data: venda.data,
        observacoes: venda.observacoes,
      })
      .select()
      .single();

    if (vendaError) throw vendaError;

    // 2. Insere os itens da venda
    if (venda.itens && venda.itens.length > 0) {
      const itensVenda = venda.itens.map(item => ({
        venda_id: vendaData.id,
        produto_id: item.produto_id || null,
        servico_id: item.servico_id || null,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        subtotal: item.subtotal,
        // NÃO envie id nem data!
      }));

      const { error: itensError } = await supabase
        .from('itens_venda')
        .insert(itensVenda);

      if (itensError) throw itensError;
    }

    return vendaData as Venda;
  },

  async atualizar(id: string, venda: Partial<Venda>) {
    const { data, error } = await supabase
      .from('vendas')
      .update(venda)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Venda;
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('vendas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Exemplo de item de venda
const exemploItemVenda = {
  venda_id: "uuid-da-venda",
  produto_id: "uuid-do-produto", // ou null se for serviço
  servico_id: null,              // ou uuid-do-servico se for serviço
  quantidade: 2,
  preco_unitario: 10.00,
  subtotal: 20.00
};