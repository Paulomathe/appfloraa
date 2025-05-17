import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Pressable } from 'react-native';
import { Button, FAB, Input, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Servico } from '@/types';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { router } from 'expo-router';
import { useEmpresa } from '@/contexts/EmpresaContext';
import CardCustom from '@/components/CardCustom';

export default function Servicos() {
  const { empresa } = useEmpresa();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoServico, setNovoServico] = useState<Omit<Servico, 'id'>>({
    nome: '',
    preco: 0,
    descricao: '',
  });
  const [carregando, setCarregando] = useState(true);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    if (empresa) carregarServicos();
  }, [empresa]);

  const carregarServicos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('empresa_id', empresa?.id);
      if (error) throw error;
      setServicos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os serviços');
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async () => {
    if (!novoServico.nome.trim()) {
      Alert.alert('Erro', 'O nome do serviço é obrigatório');
      return;
    }
    if (novoServico.preco <= 0) {
      Alert.alert('Erro', 'O preço deve ser maior que zero');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert([{ ...novoServico, empresa_id: empresa?.id }])
        .select('*');
      if (error) throw error;
      setServicos(data);
      setNovoServico({ nome: '', preco: 0, descricao: '' });
      setMostrarFormulario(false);
      Alert.alert('Sucesso', 'Serviço cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o serviço');
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
                .eq('id', servico.id)
                .eq('empresa_id', empresa?.id);
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

      <FlatList
        data={servicos}
        renderItem={renderServico}
        keyExtractor={(item) => item.id}
        refreshing={carregando}
        onRefresh={carregarServicos}
        contentContainerStyle={styles.lista}
      />

      {mostrarFormulario ? (
        <CardCustom containerStyle={styles.card}>
          <CardCustom.Title>Novo Serviço</CardCustom.Title>
          <CardCustom.Divider />
          <Input
            label="Nome"
            value={novoServico.nome}
            onChangeText={(text) => setNovoServico({ ...novoServico, nome: text })}
            placeholder="Nome do serviço"
            autoCapitalize="words"
          />
          <Input
            label="Preço"
            value={novoServico.preco > 0 ? novoServico.preco.toString() : ''}
            onChangeText={(text) => {
              const preco = text.replace(',', '.');
              setNovoServico({ ...novoServico, preco: parseFloat(preco) || 0 });
            }}
            placeholder="0,00"
            keyboardType="numeric"
          />
          <Input
            label="Descrição"
            value={novoServico.descricao}
            onChangeText={(text) => setNovoServico({ ...novoServico, descricao: text })}
            placeholder="Descrição do serviço"
            multiline
            numberOfLines={3}
          />
          <Button
            title="Salvar"
            onPress={handleSubmit}
            buttonStyle={styles.saveButton}
            loading={carregando}
          />
          <Button
            title="Cancelar"
            onPress={() => setMostrarFormulario(false)}
            buttonStyle={styles.cancelButton}
            type="outline"
          />
        </CardCustom>
      ) : (
        <FAB
          placement="right"
          icon={{ name: 'add', color: colors.white }}
          color={colors.primary}
          onPress={() => setMostrarFormulario(true)}
        />
      )}
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
  saveButton: {
    backgroundColor: colors.primary,
    marginVertical: 8,
  },
  cancelButton: {
    borderColor: colors.textLight,
    marginVertical: 8,
  },
  card: {
    margin: 8,
    borderRadius: 8,
  },
}); 