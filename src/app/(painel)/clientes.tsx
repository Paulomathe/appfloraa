import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Pressable } from 'react-native';
import { Button, ListItem, Input } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Cliente } from '@/types';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { router } from 'expo-router';

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [lastTap, setLastTap] = useState(0);
  const [busca, setBusca] = useState('');
  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*');
      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os clientes');
    } finally {
      setCarregando(false);
    }
  };

  const handleDoubleTap = (cliente: Cliente) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      handleEditar(cliente);
    }
    setLastTap(now);
  };

  const handleExcluir = async (cliente: Cliente) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o cliente "${cliente.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase
                .from('clientes')
                .delete()
                .eq('id', cliente.id);
              Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
              carregarClientes();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o cliente');
            }
          },
        },
      ]
    );
  };

  const handleEditar = (cliente: Cliente) => {
    router.push({
      pathname: '/(painel)/clientes/cadastrar',
      params: { id: cliente.id }
    });
  };

  const renderCliente = ({ item }: { item: Cliente }) => (
    <Pressable onPress={() => handleDoubleTap(item)}>
      <ListItem
        bottomDivider
        containerStyle={styles.listItem}
      >
        <FontAwesome name="user" size={24} color={colors.textLight} />
        <ListItem.Content>
          <ListItem.Title style={styles.title}>{item.nome}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>{item.telefone}</ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>{item.email}</ListItem.Subtitle>
        </ListItem.Content>
        <View style={styles.actions}>
          <Button
            icon={<FontAwesome name="edit" size={20} color={colors.primary} />}
            type="clear"
            onPress={() => handleEditar(item)}
          />
          <Button
            icon={<FontAwesome name="trash" size={20} color={colors.error} />}
            type="clear"
            onPress={() => handleExcluir(item)}
          />
        </View>
      </ListItem>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Cadastrar Cliente"
          icon={<FontAwesome name="plus" size={20} color={colors.white} style={styles.buttonIcon} />}
          buttonStyle={styles.cadastrarButton}
          onPress={() => router.push('/(painel)/clientes/cadastrar')}
        />
      </View>

      <Input
        placeholder="Buscar cliente..."
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={clientesFiltrados}
        renderItem={renderCliente}
        keyExtractor={(item) => item.id}
        refreshing={carregando}
        onRefresh={carregarClientes}
        contentContainerStyle={styles.lista}
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
    padding: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cadastrarButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  lista: {
    padding: 8,
  },
  listItem: {
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});