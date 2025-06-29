import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { router } from 'expo-router';

export default function CadastrarServico() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (id) carregarServico();
  }, [id]);

  const carregarServico = async () => {
    try {
      setCarregando(true);
      const { data } = await supabase.from('servicos').select('*').eq('id', id).single();
      if (data) {
        setNome(data.nome);
        setPreco(data.preco.toString());
        setDescricao(data.descricao || '');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do serviço');
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
    try {
      setCarregando(true);
      const dadosServico = { nome, preco: Number(preco), descricao };
      if (id) {
        await supabase.from('servicos').update(dadosServico).eq('id', id);
        Alert.alert('Sucesso', 'Serviço atualizado com sucesso!');
      } else {
        await supabase.from('servicos').insert([dadosServico]);
        Alert.alert('Sucesso', 'Serviço cadastrado com sucesso!');
      }
      setNome('');
      setPreco('');
      setDescricao('');
      router.push('/(painel)/servicos');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o serviço');
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
          onPress={() => router.push('/(painel)/servicos')}
          buttonStyle={styles.voltarButton}
        />
      </View>
      <ScrollView style={styles.form}>
        <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Nome do serviço" autoCapitalize="words" />
        <Input label="Preço" value={preco} onChangeText={setPreco} placeholder="Preço do serviço" keyboardType="numeric" />
        <Input label="Descrição" value={descricao} onChangeText={setDescricao} placeholder="Descrição" multiline numberOfLines={3} />
        <Button title={id ? "Atualizar" : "Cadastrar"} onPress={handleSubmit} loading={carregando} disabled={carregando} buttonStyle={styles.submitButton} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: 16,
    backgroundColor: colors.white, // igual clientes
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  voltarButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    alignSelf: 'flex-start', // igual clientes
  },
  buttonIcon: {
    marginRight: 8,
  },
  form: { padding: 16 },
  submitButton: { backgroundColor: colors.primary, marginTop: 16 },
});