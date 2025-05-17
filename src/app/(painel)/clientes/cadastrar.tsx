import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useEmpresa, Empresa } from '@/contexts/EmpresaContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CadastrarCliente() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { empresa, setEmpresa } = useEmpresa();
  const { user } = useAuth();

  useEffect(() => {
    if (id && empresa) {
      carregarCliente();
    }
  }, [id, empresa]);

  const carregarCliente = async () => {
    try {
      setCarregando(true);
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .eq('empresa_id', empresa?.id)
        .single();
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
    if (!empresa) {
      Alert.alert('Erro', 'Selecione uma filial antes de cadastrar.');
      return;
    }
    try {
      setCarregando(true);
      if (id) {
        await supabase
          .from('clientes')
          .update({ nome, telefone, email })
          .eq('id', id)
          .eq('empresa_id', empresa.id);
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      } else {
        await supabase
          .from('clientes')
          .insert([{ nome, telefone, email, empresa_id: empresa.id }]);
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cliente');
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (cliente: Cliente) => {
    if (!empresa) {
      Alert.alert('Erro', 'Selecione uma filial.');
      return;
    }
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
              const { error, count } = await supabase
                .from('clientes')
                .delete({ count: 'exact' })
                .eq('id', cliente.id)
                .eq('empresa_id', empresa.id);

              if (error) throw error;
              if (count === 0) {
                Alert.alert('Erro', 'Nenhum registro foi excluído. Verifique se o cliente pertence à filial selecionada e se você tem permissão.');
              } else {
                Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
                carregarClientes();
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o cliente');
            }
          },
        },
      ]
    );
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
        <Input
          label="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do cliente"
          autoCapitalize="words"
        />

        <Input
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Telefone do cliente"
          keyboardType="phone-pad"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email do cliente"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title={id ? "Atualizar" : "Cadastrar"}
          onPress={handleSubmit}
          loading={carregando}
          disabled={carregando}
          buttonStyle={styles.submitButton}
        />
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