import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import { Button } from '@rneui/themed';
import { router, useNavigation } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Venda } from '@/types';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import CardCustom from '@/components/CardCustom';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Home() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [lastTap, setLastTap] = useState(0);
  const navigation = useNavigation();

  // Filtro de datas
  const [dataInicial, setDataInicial] = useState<Date | null>(null);
  const [dataFinal, setDataFinal] = useState<Date | null>(null);
  const [showDataInicial, setShowDataInicial] = useState(false);
  const [showDataFinal, setShowDataFinal] = useState(false);

  // Soma total das vendas do período filtrado
  const totalVendas = vendas.reduce((soma, venda) => soma + (venda.valor || 0), 0);

  useEffect(() => {
    carregarVendas();
  }, [dataInicial, dataFinal]);

  const carregarVendas = async () => {
    try {
      setCarregando(true);
      let query = supabase.from('vendas').select('*');

      if (dataInicial) {
        const inicio = new Date(dataInicial);
        inicio.setHours(0, 0, 0, 0);
        query = query.gte('data', inicio.toISOString());
      }
      if (dataFinal) {
        const fim = new Date(dataFinal);
        fim.setHours(23, 59, 59, 999);
        query = query.lte('data', fim.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      // Garante que cada venda tenha o campo itens como array
      setVendas(
        (data || []).map((venda: any) => ({
          ...venda,
          itens: Array.isArray(venda.itens) ? venda.itens : [],
        }))
      );
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
  }, [navigation, dataInicial, dataFinal]);

  // Botões rápidos
  const setHoje = () => {
    const hoje = new Date();
    setDataInicial(new Date(hoje.setHours(0, 0, 0, 0)));
    setDataFinal(new Date());
  };
  const setUltimos7Dias = () => {
    const hoje = new Date();
    const inicio = new Date();
    inicio.setDate(hoje.getDate() - 6);
    inicio.setHours(0, 0, 0, 0);
    setDataInicial(inicio);
    setDataFinal(new Date());
  };
  const setEsteMes = () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    inicio.setHours(0, 0, 0, 0);
    setDataInicial(inicio);
    setDataFinal(new Date());
  };

  const limparFiltro = () => {
    setDataInicial(null);
    setDataFinal(null);
  };

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

  const handleEditar = (venda: Venda) => {
    router.push({
      pathname: '/(painel)/vendas/editar',
      params: { id: venda.id }
    });
  };

  const handleExcluir = async (venda: Venda) => {
    Alert.alert(
      'Excluir venda',
      `Deseja realmente excluir a venda de ${venda.cliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.from('vendas').delete().eq('id', venda.id);
              carregarVendas();
              Alert.alert('Sucesso', 'Venda excluída!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a venda');
            }
          },
        },
      ]
    );
  };

  const renderVenda = ({ item }: { item: Venda }) => (
    <Pressable onPress={() => handleDoubleTap(item)}>
      <CardCustom containerStyle={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardCustom.Title>{item.cliente}</CardCustom.Title>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              icon={<FontAwesome name="edit" size={18} color={colors.primary} />}
              type="clear"
              onPress={() => handleEditar(item)}
              buttonStyle={{ padding: 4 }}
            />
            <Button
              icon={<FontAwesome name="trash" size={18} color={colors.error} />}
              type="clear"
              onPress={() => handleExcluir(item)}
              buttonStyle={{ padding: 4 }}
            />
          </View>
        </View>
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
      <Text style={styles.emptyText}>Nenhuma venda encontrada no período</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filtro de datas */}
      <View style={styles.filtroDatas}>
        <Button
          title={dataInicial ? `De: ${dataInicial.toLocaleDateString()}` : 'Data inicial'}
          onPress={() => setShowDataInicial(true)}
          buttonStyle={styles.filtroButton}
          type="outline"
        />
        <Button
          title={dataFinal ? `Até: ${dataFinal.toLocaleDateString()}` : 'Data final'}
          onPress={() => setShowDataFinal(true)}
          buttonStyle={styles.filtroButton}
          type="outline"
        />
        {(dataInicial || dataFinal) && (
          <Button
            title="Limpar"
            onPress={limparFiltro}
            buttonStyle={styles.filtroButton}
            type="clear"
          />
        )}
      </View>
      {showDataInicial && (
        <DateTimePicker
          value={dataInicial || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, date) => {
            setShowDataInicial(false);
            if (date) setDataInicial(date);
          }}
        />
      )}
      {showDataFinal && (
        <DateTimePicker
          value={dataFinal || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, date) => {
            setShowDataFinal(false);
            if (date) setDataFinal(date);
          }}
        />
      )}

      {/* Total de vendas do período */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total do período:</Text>
        <Text style={styles.totalValor}>R$ {totalVendas.toFixed(2)}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.titulo}>Vendas</Text>
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
  filtroDatas: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 12,
    gap: 8,
  },
  filtroRapido: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
    gap: 8,
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.text,
  },
  totalValor: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primary,
  },
  filtroButton: {
    minWidth: 110,
    marginHorizontal: 2,
    borderColor: colors.primary,
  },
});