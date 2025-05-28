import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';

export default function CadastrarProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estoque, setEstoque] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (id) carregarProduto();
  }, [id]);

  const carregarProduto = async () => {
    try {
      setCarregando(true);
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setNome(data.nome);
        setPreco(data.preco.toString());
        setDescricao(data.descricao || '');
        setEstoque(data.estoque.toString());
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do produto');
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }
    if (!preco || isNaN(Number(preco)) || Number(preco) <= 0) {
      Alert.alert('Erro', 'O preço deve ser um número maior que zero');
      return;
    }
    if (!estoque || isNaN(Number(estoque))) {
      Alert.alert('Erro', 'A quantidade em estoque deve ser um número válido');
      return;
    }

    try {
      setCarregando(true);
      const dadosProduto = {
        nome,
        preco: Number(preco),
        descricao,
        estoque: Number(estoque),
      };

      if (id) {
        await supabase
          .from('produtos')
          .update(dadosProduto)
          .eq('id', id);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        await supabase
          .from('produtos')
          .insert([dadosProduto]);
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      }
      setNome('');
      setPreco('');
      setDescricao('');
      setEstoque('');
      router.push('/(painel)/produtos');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          icon={<FontAwesome name="arrow-left" size={20} color={colors.white} style={styles.buttonIcon} />}
          title="Voltar"
          onPress={() => router.push('/(painel)/produtos')}
          buttonStyle={styles.voltarButton}
        />
      </View>
      <ScrollView style={styles.form}>
        <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Nome do produto" autoCapitalize="words" />
        <Input label="Preço" value={preco} onChangeText={setPreco} placeholder="Preço do produto" keyboardType="numeric" />
        <Input label="Descrição" value={descricao} onChangeText={setDescricao} placeholder="Descrição do produto" multiline numberOfLines={3} />
        <Input label="Estoque" value={estoque} onChangeText={setEstoque} placeholder="Quantidade em estoque" keyboardType="numeric" />
        <Button title={id ? "Atualizar" : "Cadastrar"} onPress={handleSubmit} loading={carregando} disabled={carregando} buttonStyle={styles.submitButton} />
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
  form: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginTop: 16,
  },
});