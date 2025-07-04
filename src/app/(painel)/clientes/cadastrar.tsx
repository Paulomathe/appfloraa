import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';

export default function CadastrarCliente() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (id) carregarCliente();
  }, [id]);

  const carregarCliente = async () => {
    try {
      setCarregando(true);
      const { data } = await supabase.from('clientes').select('*').eq('id', id).single();
      if (data) {
        setNome(data.nome);
        setTelefone(data.telefone);
        setEmail(data.email);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do cliente');
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }
    try {
      setCarregando(true);
      if (id) {
        await supabase.from('clientes').update({ nome, telefone, email }).eq('id', id);
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      } else {
        await supabase.from('clientes').insert([{ nome, telefone, email }]);
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      }
      setNome('');
      setTelefone('');
      setEmail('');
      router.push('/(painel)/clientes');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cliente');
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
          onPress={() => router.push('/(painel)/clientes')}
          buttonStyle={styles.voltarButton}
        />
      </View>
      <ScrollView style={styles.form}>
        <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Nome do cliente" autoCapitalize="words" />
        <Input label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="Telefone" keyboardType="phone-pad" />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
        <Button title={id ? "Atualizar" : "Cadastrar"} onPress={handleSubmit} loading={carregando} disabled={carregando} buttonStyle={styles.submitButton} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  form: { padding: 16 },
  submitButton: { backgroundColor: colors.primary, marginTop: 16 },
});