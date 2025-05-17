import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { Button, Input, ListItem } from '@rneui/themed';
import { router, useNavigation } from 'expo-router';
import { vendaService } from '@/services/supabase';
import { Venda, Produto, Servico, ItemVenda } from '@/types';
import colors from '@/constants/colors';
import ProdutoSearch from '@/components/ProdutoSearch';
import ServicoSearch from '@/components/ServicoSearch';
import { FontAwesome } from '@expo/vector-icons';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { supabase } from '@/lib/supabase';
import CardCustom from '@/components/CardCustom';

export default function NovaVenda() {
  const navigation = useNavigation();
  const { empresa } = useEmpresa();
  const [venda, setVenda] = useState<Omit<Venda, 'id'>>({
    cliente: '',
    vendedor: '',
    valor: 0,
    data: new Date().toISOString(),
    observacoes: '',
    itens: [],
  });
  const [carregando, setCarregando] = useState(false);

  // Limpa os dados quando a tela é focada
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setVenda({
        cliente: '',
        vendedor: '',
        valor: 0,
        data: new Date().toISOString(),
        observacoes: '',
        itens: [],
      });
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddProduto = (produto: Produto) => {
    const item: ItemVenda = {
      id: Math.random().toString(), // Temporário, será substituído pelo Supabase
      produto_id: produto.id,
      quantidade: 1,
      preco_unitario: produto.preco,
      subtotal: produto.preco,
    };

    const novoValor = venda.valor + item.subtotal;
    setVenda({
      ...venda,
      itens: [...venda.itens, item],
      valor: novoValor,
    });
  };

  const handleAddServico = (servico: Servico) => {
    const item: ItemVenda = {
      id: Math.random().toString(), // Temporário, será substituído pelo Supabase
      servico_id: servico.id,
      quantidade: 1,
      preco_unitario: servico.preco,
      subtotal: servico.preco,
    };

    const novoValor = venda.valor + item.subtotal;
    setVenda({
      ...venda,
      itens: [...venda.itens, item],
      valor: novoValor,
    });
  };

  const handleRemoveItem = (index: number) => {
    const item = venda.itens[index];
    const novoValor = venda.valor - item.subtotal;
    const novosItens = venda.itens.filter((_, i) => i !== index);
    setVenda({
      ...venda,
      itens: novosItens,
      valor: novoValor,
    });
  };

  const handleUpdateQuantidade = (index: number, quantidade: number) => {
    if (quantidade < 1) return;

    const novosItens = [...venda.itens];
    const item = novosItens[index];
    const subtotalAntigo = item.subtotal;
    item.quantidade = quantidade;
    item.subtotal = item.preco_unitario * quantidade;
    
    const novoValor = venda.valor - subtotalAntigo + item.subtotal;
    setVenda({
      ...venda,
      itens: novosItens,
      valor: novoValor,
    });
  };

  const handleSubmit = async () => {
    if (!empresa) {
      Alert.alert('Erro', 'Selecione uma filial antes de cadastrar.');
      return;
    }
    if (!venda.cliente.trim()) {
      Alert.alert('Erro', 'O nome do cliente é obrigatório');
      return;
    }
    if (!venda.vendedor.trim()) {
      Alert.alert('Erro', 'O nome do vendedor é obrigatório');
      return;
    }
    if (venda.itens.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um produto ou serviço');
      return;
    }

    try {
      setCarregando(true);
      await supabase
        .from('vendas')
        .insert([{ ...venda, empresa_id: empresa.id }]);
      Alert.alert('Sucesso', 'Venda cadastrada com sucesso!');
      router.replace('/(painel)/home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a venda');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Cliente"
          value={venda.cliente}
          onChangeText={(text) => setVenda({ ...venda, cliente: text })}
          placeholder="Nome do cliente"
          autoCapitalize="words"
        />

        <Input
          label="Vendedor"
          value={venda.vendedor}
          onChangeText={(text) => setVenda({ ...venda, vendedor: text })}
          placeholder="Nome do vendedor"
          autoCapitalize="words"
        />

        <CardCustom containerStyle={styles.card}>
          <CardCustom.Title>Produtos</CardCustom.Title>
          <CardCustom.Divider />
          <ProdutoSearch onSelect={handleAddProduto} />
        </CardCustom>

        <CardCustom containerStyle={styles.card}>
          <CardCustom.Title>Serviços (Opcional)</CardCustom.Title>
          <CardCustom.Divider />
          <ServicoSearch onSelect={handleAddServico} />
        </CardCustom>

        {venda.itens.length > 0 && (
          <CardCustom containerStyle={styles.card}>
            <CardCustom.Title>Itens da Venda</CardCustom.Title>
            <CardCustom.Divider />
            {venda.itens.map((item, index) => (
              <ListItem key={item.id} bottomDivider>
                <FontAwesome
                  name={item.produto_id ? 'cube' : 'wrench'}
                  size={24}
                  color={colors.textLight}
                />
                <ListItem.Content>
                  <ListItem.Title>
                    {item.produto_id ? 'Produto' : 'Serviço'} #{index + 1}
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    Quantidade: {item.quantidade} x R$ {item.preco_unitario.toFixed(2)}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    Subtotal: R$ {item.subtotal.toFixed(2)}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <Button
                  icon={<FontAwesome name="minus" size={16} color={colors.white} />}
                  onPress={() => handleUpdateQuantidade(index, item.quantidade - 1)}
                  buttonStyle={[styles.quantidadeButton, { marginRight: 4 }]}
                />
                <Button
                  icon={<FontAwesome name="plus" size={16} color={colors.white} />}
                  onPress={() => handleUpdateQuantidade(index, item.quantidade + 1)}
                  buttonStyle={[styles.quantidadeButton, { marginRight: 4 }]}
                />
                <Button
                  icon={<FontAwesome name="trash" size={16} color={colors.white} />}
                  onPress={() => handleRemoveItem(index)}
                  buttonStyle={[styles.quantidadeButton, { backgroundColor: colors.error }]}
                />
              </ListItem>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValor}>R$ {venda.valor.toFixed(2)}</Text>
            </View>
          </CardCustom>
        )}

        <Input
          label="Observações"
          value={venda.observacoes}
          onChangeText={(text) => setVenda({ ...venda, observacoes: text })}
          placeholder="Observações sobre a venda"
          multiline
          numberOfLines={4}
        />

        <Button
          title="Registrar Venda"
          onPress={handleSubmit}
          buttonStyle={styles.button}
          loading={carregando}
          disabled={carregando}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 16,
    gap: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
  },
  quantidadeButton: {
    padding: 8,
    minWidth: 0,
    backgroundColor: colors.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  card: {
    margin: 8,
    borderRadius: 8,
  },
}); 