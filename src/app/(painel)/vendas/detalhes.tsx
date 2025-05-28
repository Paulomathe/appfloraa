import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { ListItem } from '@rneui/themed';
import { useLocalSearchParams } from 'expo-router';
import { vendaService } from '@/services/supabase';
import { Venda } from '@/types';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import CardCustom from '@/components/CardCustom';

export default function DetalhesVenda() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [venda, setVenda] = useState<Venda | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarVenda();
  }, [id]);

  const carregarVenda = async () => {
    try {
      setCarregando(true);
      const vendas = await vendaService.listar();
      const vendaEncontrada = vendas.find(v => v.id === id);

      if (!vendaEncontrada) {
        Alert.alert('Aviso', 'Venda não encontrada');
        return;
      }

      setVenda(vendaEncontrada);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da venda');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!venda) {
    return (
      <View style={styles.container}>
        <Text>Venda não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <CardCustom containerStyle={styles.card}>
        <CardCustom.Title>Informações da Venda</CardCustom.Title>
        <CardCustom.Divider />
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Cliente:</Text>
          <Text>{venda.cliente}</Text>
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Vendedor:</Text>
          <Text>{venda.vendedor}</Text>
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Data:</Text>
          <Text>{new Date(venda.data).toLocaleString()}</Text>
        </View>
        {venda.observacoes ? (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Observações:</Text>
            <Text>{venda.observacoes}</Text>
          </View>
        ) : null}
      </CardCustom>

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
          </ListItem>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValor}>R$ {venda.valor.toFixed(2)}</Text>
        </View>
      </CardCustom>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    margin: 12,
  },
  header: {
    margin: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValor: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primary,
  },
});