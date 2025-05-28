import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Pressable } from 'react-native';
import { Button, Input, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Servico } from '@/types';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { router } from 'expo-router';

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [lastTap, setLastTap] = useState(0);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*');
      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os serviços');
    } finally {
      setCarregando(false);
    }
  };

  const handleDoubleTap = (servico: Servico) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      handleEditar(servico);
    }
    setLastTap(now);
  };

  const handleExcluir = async (servico: Servico) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o serviço "${servico.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('servicos')
                .delete()
                .eq('id', servico.id);
              if (error) throw error;
              Alert.alert('Sucesso', 'Serviço excluído com sucesso!');
              carregarServicos();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o serviço');
            }
          },
        },
      ]
    );
  };

  const handleEditar = (servico: Servico) => {
    router.push({
      pathname: '/(painel)/servicos/cadastrar',
      params: { id: servico.id }
    });
  };

  const servicosFiltrados = servicos.filter(s =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const renderServico = ({ item }: { item: Servico }) => (
    <Pressable onPress={() => handleDoubleTap(item)}>
      <ListItem
        bottomDivider
        containerStyle={styles.listItem}
      >
        <FontAwesome name="wrench" size={24} color={colors.textLight} />
        <ListItem.Content>
          <ListItem.Title style={styles.title}>{item.nome}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            Preço: R$ {item.preco.toFixed(2)}
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
          title="Cadastrar Serviço"
          icon={<FontAwesome name="plus" size={20} color={colors.white} style={styles.buttonIcon} />}
          buttonStyle={styles.cadastrarButton}
          onPress={() => router.push('/(painel)/servicos/cadastrar')}
        />
      </View>

      <Input
        placeholder="Buscar serviço..."
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={servicosFiltrados}
        renderItem={renderServico}
        keyExtractor={(item) => item.id}
        refreshing={carregando}
        onRefresh={carregarServicos}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={null}
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