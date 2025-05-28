import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import colors from '@/constants/colors';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password || !name) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // Cadastro simples no Supabase (ajuste conforme sua tabela)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        Alert.alert('Erro', error.message || 'Erro ao cadastrar.');
        setLoading(false);
        return;
      }

      Alert.alert(
        'Sucesso',
        'Cadastro realizado com sucesso! Faça login para continuar.',
        [{ text: 'OK', onPress: () => router.replace('/signin/page') }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro desconhecido ao cadastrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.logoText}>
          <Text style={{ color: colors.green }}>PDV MOBILE</Text>
        </Text>
        <Text style={styles.slogan}>Criar uma conta</Text>
      </View>
      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome completo..."
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
          />
        </View>
        <View>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.textLight}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Cadastrar'}
          </Text>
        </Pressable>
        <Link href="/signin/page" style={styles.link}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: 34,
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 34,
    color: colors.white,
    marginBottom: 34,
  },
  form: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  label: {
    color: colors.zinc,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
    color: colors.text,
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 14,
    top: 34,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  link: {
    alignSelf: 'center',
    marginTop: 16,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});