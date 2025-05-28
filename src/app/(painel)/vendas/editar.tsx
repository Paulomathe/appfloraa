import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, Text, StyleSheet } from 'react-native';
import { Input, Button, ListItem } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import ProdutoSearch from '@/components/ProdutoSearch';
import ServicoSearch from '@/components/ServicoSearch';

export default function EditarVenda() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cliente, setCliente] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [itens, setItens] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      // Busca a venda
      const { data: venda } = await supabase.from('vendas').select('*').eq('id', id).single();
      // Busca os itens da venda
      const { data: itensVenda } = await supabase.from('itens_venda').select('*').eq('venda_id', id);

      if (venda) {
        setCliente(venda.cliente);
        setObservacoes(venda.observacoes || '');
        setItens(itensVenda || []);
      }
      setCarregando(false);
    }
    carregar();
  }, [id]);

  // Adicionar produto
  type Produto = {
    id: string;
    preco: number;
    nome: string;
  };

  const handleAddProduto = (produto: Produto) => {
    const itemExistente = itens.find(i => i.produto_id === produto.id);
    if (itemExistente) {
      Alert.alert('Produto já adicionado');
      return;
    }
    const novoItem = {
      id: Math.random().toString(),
      produto_id: produto.id,
      quantidade: 1,
      preco_unitario: produto.preco,
      subtotal: produto.preco,
      nome: produto.nome,
    };
    setItens([...itens, novoItem]);
  };

  // Adicionar serviço
  type Servico = {
    id: string;
    preco: number;
    nome: string;
  };

  const handleAddServico = (servico: Servico) => {
    const itemExistente = itens.find(i => i.servico_id === servico.id);
    if (itemExistente) {
      Alert.alert('Serviço já adicionado');
      return;
    }
    const novoItem = {
      id: Math.random().toString(),
      servico_id: servico.id,
      quantidade: 1,
      preco_unitario: servico.preco,
      subtotal: servico.preco,
      nome: servico.nome,
    };
    setItens([...itens, novoItem]);
  };

  // Atualizar quantidade
  const handleUpdateQuantidade = (index: number, quantidade: number) => {
    if (quantidade < 1) return;
    const novosItens = [...itens];
    const item = novosItens[index];
    item.quantidade = quantidade;
    item.subtotal = item.preco_unitario * quantidade;
    setItens(novosItens);
  };

  // Remover item
  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const valorTotal = itens.reduce((soma, i) => soma + i.subtotal, 0);

  const handleSalvar = async () => {
    if (!cliente.trim()) {
      Alert.alert('Erro', 'O nome do cliente é obrigatório');
      return;
    }
    if (itens.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um produto ou serviço');
      return;
    }
    try {
      setCarregando(true);
      await supabase.from('vendas').update({
        cliente,
        observacoes,
        itens,
        valor: valorTotal,
      }).eq('id', id);
      Alert.alert('Sucesso', 'Venda atualizada!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a venda');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Carregando...</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Input label="Cliente" value={cliente} onChangeText={setCliente} />
      <Input label="Observações" value={observacoes} onChangeText={setObservacoes} multiline />

      <View style={{ margin: 8 }}>
        <View style={{ zIndex: 2 }}>
          <ProdutoSearch onSelect={handleAddProduto} />
        </View>
        <View style={{ zIndex: 1 }}>
          <ServicoSearch onSelect={handleAddServico} />
        </View>
      </View>

      <Text style={{ fontWeight: 'bold', marginLeft: 16, marginTop: 16, marginBottom: 8 }}>
        Itens da Venda
      </Text>
      {itens.length === 0 && (
        <Text style={{ marginLeft: 16, color: colors.textLight }}>Nenhum item adicionado</Text>
      )}
      {itens.map((item, index) => (
        <ListItem key={item.id} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              {(item.produto_id ? 'Produto' : 'Serviço') + (item.nome ? `: ${item.nome}` : '')}
            </ListItem.Title>
            <ListItem.Subtitle>
              Quantidade:
              <Button
                title="-"
                onPress={() => handleUpdateQuantidade(index, item.quantidade - 1)}
                buttonStyle={{ minWidth: 32, marginHorizontal: 4, backgroundColor: colors.primary }}
              />
              <Text style={{ marginHorizontal: 8 }}>{item.quantidade}</Text>
              <Button
                title="+"
                onPress={() => handleUpdateQuantidade(index, item.quantidade + 1)}
                buttonStyle={{ minWidth: 32, marginHorizontal: 4, backgroundColor: colors.primary }}
              />
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              Preço unitário: R$ {item.preco_unitario.toFixed(2)}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              Subtotal: R$ {item.subtotal.toFixed(2)}
            </ListItem.Subtitle>
          </ListItem.Content>
          <Button
            icon={<Text style={{ color: colors.error, fontSize: 18 }}>🗑️</Text>}
            onPress={() => handleRemoveItem(index)}
            buttonStyle={{ backgroundColor: 'transparent' }}
          />
        </ListItem>
      ))}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 16 }}>
        <Text style={{ fontWeight: 'bold' }}>Total:</Text>
        <Text style={{ fontWeight: 'bold', color: colors.primary }}>
          R$ {valorTotal.toFixed(2)}
        </Text>
      </View>

      <Button
        title="Salvar"
        onPress={handleSalvar}
        loading={carregando}
        buttonStyle={{ backgroundColor: colors.primary, margin: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10, // aumenta o zIndex do container
  },
  resultados: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 10, // aumenta para Android
    zIndex: 20,    // aumenta para garantir sobreposição
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
});