import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { Button } from '@rneui/themed';
import { router, useNavigation } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { Venda } from '@/types';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import CardCustom from '@/components/CardCustom';

export default function Home() {
  const { empresa } = useEmpresa();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [lastTap, setLastTap] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (empresa) carregarVendas();
  }, [empresa]);

  const carregarVendas = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('vendas')
        .select('*')
        .eq('empresa_id', empresa?.id);
      if (error) throw error;
      setVendas(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as vendas');
    } finally {
      setCarregando(false);
    }
  };

  // Recarrega as vendas quando a tela é focada
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarVendas();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDoubleTap = (venda: Venda) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      router.push({
        pathname: '/(painel)/vendas/detalhes',
        params: { id: venda.id }
      });
    }
    
    setLastTap(now);
  };

  const renderVenda = ({ item }: { item: Venda }) => (
    <Pressable onPress={() => handleDoubleTap(item)}>
      <CardCustom containerStyle={styles.card}>
        <CardCustom.Title>{item.cliente}</CardCustom.Title>
        <CardCustom.Divider />
        <View style={styles.vendaInfo}>
          <Text style={styles.text}>Vendedor: {item.vendedor}</Text>
          <Text style={styles.text}>Valor: R$ {item.valor.toFixed(2)}</Text>
          <Text style={styles.text}>Data: {new Date(item.data).toLocaleString()}</Text>
          {item.observacoes && <Text style={styles.text}>Obs: {item.observacoes}</Text>}
        </View>
      </CardCustom>
    </Pressable>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhuma venda registrada hoje</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Vendas do Dia</Text>
        <Button
          title="Nova Venda"
          icon={<FontAwesome name="plus" size={20} color={colors.white} style={styles.buttonIcon} />}
          buttonStyle={styles.novaVendaButton}
          onPress={() => router.push('/(painel)/nova-venda')}
        />
      </View>
      <FlatList
        data={vendas}
        renderItem={renderVenda}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshing={carregando}
        onRefresh={carregarVendas}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  lista: {
    padding: 8,
    flexGrow: 1,
  },
  vendaInfo: {
    gap: 8,
  },
  text: {
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 16,
  },
  novaVendaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  card: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});