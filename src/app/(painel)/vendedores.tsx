import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Pressable } from 'react-native';
import { Button, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Vendedor } from '@/types';
import { vendedorService } from '@/services/supabase';
import colors from '@/constants/colors';
import { router } from 'expo-router';

export default function Vendedores() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    carregarVendedores();
  }, []);

  const carregarVendedores = async () => {
    try {
      setCarregando(true);
      const data = await vendedorService.listar();
      setVendedores(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os vendedores');
    } finally {
      setCarregando(false);
    }
  };

  const handleDoubleTap = (vendedor: Vendedor) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      handleEditar(vendedor);
    }
    
    setLastTap(now);
  };

  const handleExcluir = async (vendedor: Vendedor) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o vendedor "${vendedor.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await vendedorService.excluir(vendedor.id);
              Alert.alert('Sucesso', 'Vendedor excluído com sucesso!');
              carregarVendedores();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o vendedor');
            }
          },
        },
      ]
    );
  };

  const handleEditar = (vendedor: Vendedor) => {
    router.push({
      pathname: '/(painel)/vendedores/cadastrar',
      params: { id: vendedor.id }
    });
  };

  const renderVendedor = ({ item }: { item: Vendedor }) => (
    <Pressable onPress={() => handleDoubleTap(item)}>
      <ListItem
        bottomDivider
        containerStyle={styles.listItem}
      >
        <FontAwesome name="user-secret" size={24} color={colors.textLight} />
        <ListItem.Content>
          <ListItem.Title style={styles.title}>{item.nome}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>{item.telefone}</ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>{item.email}</ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>Comissão: {item.comissao}%</ListItem.Subtitle>
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
          title="Cadastrar Vendedor"
          icon={<FontAwesome name="plus" size={20} color={colors.white} style={styles.buttonIcon} />}
          buttonStyle={styles.cadastrarButton}
          onPress={() => router.push('/(painel)/vendedores/cadastrar')}
        />
      </View>

      <FlatList
        data={vendedores}
        renderItem={renderVendedor}
        keyExtractor={(item) => item.id}
        refreshing={carregando}
        onRefresh={carregarVendedores}
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