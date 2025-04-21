import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { Card, ListItem, Button } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { vendaService } from '@/services/supabase';
import { Venda } from '@/types';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';

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
        Alert.alert('Erro', 'Venda não encontrada');
        return;
      }
      
      setVenda(vendaEncontrada);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da venda');
    } finally {
      setCarregando(false);
    }
  };

  if (!venda) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>
          {carregando ? 'Carregando...' : 'Venda não encontrada'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          icon={<FontAwesome name="arrow-left" size={20} color={colors.white} style={styles.buttonIcon} />}
          title="Voltar"
          onPress={() => router.push('/(painel)/home')}
          buttonStyle={styles.voltarButton}
        />
      </View>

      <ScrollView>
        <Card>
          <Card.Title>Informações da Venda</Card.Title>
          <Card.Divider />
          
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{venda.cliente}</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Vendedor:</Text>
            <Text style={styles.value}>{venda.vendedor}</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>
              {new Date(venda.data).toLocaleString()}
            </Text>
          </View>
          
          {venda.observacoes && (
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Observações:</Text>
              <Text style={styles.value}>{venda.observacoes}</Text>
            </View>
          )}
        </Card>

        <Card>
          <Card.Title>Itens da Venda</Card.Title>
          <Card.Divider />
          
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
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  voltarButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  buttonIcon: {
    marginRight: 8,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.textLight,
  },
  infoContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
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
}); 