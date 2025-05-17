import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Pressable } from 'react-native';
import { Button, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Produto } from '@/types';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { router } from 'expo-router';
import { useEmpresa } from '@/contexts/EmpresaContext';

export default function Produtos() {
  const { empresa } = useEmpresa();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    if (empresa) carregarProdutos();
  }, [empresa]);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresa?.id);
      if (error) throw error;
      setProdutos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setCarregando(false);
    }
  };

  const handleDoubleTap = (produto: Produto) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      handleEditar(produto);
    }
    
    setLastTap(now);
  };

  const handleExcluir = async (produto: Produto) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o produto "${produto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase
                .from('produtos')
                .delete()
                .eq('id', produto.id);
              Alert.alert('Sucesso', 'Produto excluído com sucesso!');
              carregarProdutos();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o produto');
            }
          },
        },
      ]
    );
  };

  const handleEditar = (produto: Produto) => {
    router.push({
      pathname: '/(painel)/produtos/cadastrar',
      params: { id: produto.id }
    });
  };

  const renderProduto = ({ item }: { item: Produto }) => (
    <Pressable onPress={() => handleDoubleTap(item)}>
      <ListItem
        bottomDivider
        containerStyle={styles.listItem}
      >
        <FontAwesome name="cube" size={24} color={colors.textLight} />
        <ListItem.Content>
          <ListItem.Title style={styles.title}>{item.nome}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            Preço: R$ {item.preco.toFixed(2)}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>
            Estoque: {item.estoque} unidades
          </ListItem.Subtitle>
          {item.descricao && (
            <ListItem.Subtitle style={styles.subtitle}>
              {item.descricao}
            </ListItem.Subtitle>
          )}
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
          title="Cadastrar Produto"
          icon={<FontAwesome name="plus" size={20} color={colors.white} style={styles.buttonIcon} />}
          buttonStyle={styles.cadastrarButton}
          onPress={() => router.push('/(painel)/produtos/cadastrar')}
        />
      </View>

      <FlatList
        data={produtos}
        renderItem={renderProduto}
        keyExtractor={(item) => item.id}
        refreshing={carregando}
        onRefresh={carregarProdutos}
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