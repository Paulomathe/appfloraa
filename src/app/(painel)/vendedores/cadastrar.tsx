import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { vendedorService } from '@/services/supabase';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';

export default function CadastrarVendedor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [comissao, setComissao] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (id) carregarVendedor();
  }, [id]);

  const carregarVendedor = async () => {
    try {
      setCarregando(true);
      const { data } = await vendedorService.buscarPorId(id);
      if (data) {
        setNome(data.nome);
        setTelefone(data.telefone);
        setEmail(data.email);
        setComissao(data.comissao);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do vendedor');
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
        await vendedorService.atualizar(id, { nome, telefone, email, comissao });
        Alert.alert('Sucesso', 'Vendedor atualizado com sucesso!');
      } else {
        await vendedorService.criar({ nome, telefone, email, comissao });
        Alert.alert('Sucesso', 'Vendedor cadastrado com sucesso!');
      }
      setNome('');
      setTelefone('');
      setEmail('');
      setComissao('');
      router.push('/(painel)/vendedores');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o vendedor');
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
          onPress={() => router.push('/(painel)/vendedores')}
          buttonStyle={styles.voltarButton}
        />
      </View>
      <ScrollView style={styles.form}>
        <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Nome do vendedor" autoCapitalize="words" />
        <Input label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="Telefone" keyboardType="phone-pad" />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
        <Input label="Comissão (%)" value={comissao} onChangeText={setComissao} placeholder="Porcentagem de comissão" keyboardType="numeric" />
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