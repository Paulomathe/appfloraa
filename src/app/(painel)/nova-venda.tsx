import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, Image } from 'react-native';
import { Button, Input, ListItem } from '@rneui/themed';
import { router, useNavigation } from 'expo-router';
import { vendaService } from '@/services/supabase';
import { Venda, Produto, Servico, ItemVenda } from '@/types';
import colors from '@/constants/colors';
import ProdutoSearch from '@/components/ProdutoSearch';
import ServicoSearch from '@/components/ServicoSearch';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import CardCustom from '@/components/CardCustom';
import VendedorSearch from '@/components/VendedorSearch';
import { ClienteSearch } from '@/components/ClienteSearch';

export default function NovaVenda() {
  const navigation = useNavigation();
  const [venda, setVenda] = useState<Omit<Venda, 'id'>>({
    cliente: '',
    vendedor: '',
    valor: 0,
    data: new Date().toISOString(),
    observacoes: '',
    itens: [],
    error: false, // Inicializa como booleano, conforme o tipo em Venda
  });
  const [carregando, setCarregando] = useState(false);

  // Limpa os dados quando a tela é focada
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      return setVenda({
        cliente: '',
        vendedor: '',
        valor: 0,
        data: new Date().toISOString(),
        observacoes: '',
        itens: [],
        error: false,
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
      data: undefined
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
      data: undefined
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
      await vendaService.criar(venda); // Use o serviço, não o insert direto!
      Alert.alert('Sucesso', 'Venda cadastrada com sucesso!');
      router.replace('/(painel)/home');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar a venda');
    } finally {
      setCarregando(false);
    }
  };

  function handleAddVendedor(produto: Produto): void {
    throw new Error('Function not implemented.');
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <CardCustom containerStyle={styles.card}>
          <CardCustom.Title>Clientes</CardCustom.Title>
          <CardCustom.Divider />
          <View style={{ zIndex: 6, position: 'relative' }}>
            <ClienteSearch
              onSelect={(cliente) => setVenda({ ...venda, cliente: cliente.nome })}
              value={venda.cliente}
            />
          </View>
        </CardCustom>

        <CardCustom containerStyle={styles.card}>
          <CardCustom.Title>Vendedores</CardCustom.Title>
          <CardCustom.Divider />
          <View style={{ zIndex: 5, position: 'relative' }}>
            <VendedorSearch
              onSelect={(vendedor) => setVenda({ ...venda, vendedor: vendedor.nome })}
            />
          </View>
        </CardCustom>

        <CardCustom containerStyle={styles.card}>
          <CardCustom.Title>Produtos</CardCustom.Title>
          <CardCustom.Divider />
          <View style={{ zIndex: 4, position: 'relative' }}>
            <ProdutoSearch onSelect={handleAddProduto} />
          </View>
        </CardCustom>

        <CardCustom containerStyle={styles.card}>
          <CardCustom.Title>Serviços (Opcional)</CardCustom.Title>
          <CardCustom.Divider />
          <View style={{ zIndex: 3, position: 'relative' }}>
            <ServicoSearch onSelect={handleAddServico} />
          </View>
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
  containerDropdown: {
    position: 'relative',
    zIndex: 100, // valor alto para todos
  },
  resultados: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 10,
    zIndex: 200,
    maxHeight: 200,
  }
});