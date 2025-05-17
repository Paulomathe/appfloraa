import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from '@rneui/themed';
import CardCustom from '@/components/CardCustom';
import colors from '@/constants/colors';

// Definir o tipo para os itens de venda
type Venda = {
  id: string;
  cliente: string;
  valor: number;
  data: string;
};

// Dados de exemplo para a lista
const MOCK_VENDAS: Venda[] = [
  { id: '1', cliente: 'João Silva', valor: 150.00, data: '2025-05-03' },
  { id: '2', cliente: 'Maria Souza', valor: 85.50, data: '2025-05-03' },
  { id: '3', cliente: 'Pedro Santos', valor: 210.75, data: '2025-05-02' },
];

// Componente de teste para a home usando o CardCustom
export default function HomeTest() {
  const renderVenda = ({ item }: { item: Venda }) => (
    <CardCustom containerStyle={styles.vendaCard}>
      <CardCustom.Title>{item.cliente}</CardCustom.Title>
      <CardCustom.Divider />
      <View style={styles.vendaInfo}>
        <Text style={styles.text}>Valor: R$ {item.valor.toFixed(2)}</Text>
        <Text style={styles.text}>Data: {item.data}</Text>
      </View>
      <Button
        title="Ver Detalhes"
        buttonStyle={{ backgroundColor: colors.primary }}
        containerStyle={{ marginTop: 10 }}
        size="sm"
      />
    </CardCustom>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas Vendas</Text>
      
      <FlatList
        data={MOCK_VENDAS}
        renderItem={renderVenda}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
      />
      
      <Button
        title="Nova Venda"
        icon={{ name: 'add', color: 'white', type: 'material' }}
        buttonStyle={{ backgroundColor: colors.primary }}
        containerStyle={{ margin: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    margin: 16,
  },
  lista: {
    padding: 8,
  },
  vendaCard: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  vendaInfo: {
    gap: 8,
  },
  text: {
    color: colors.text,
  },
}); 