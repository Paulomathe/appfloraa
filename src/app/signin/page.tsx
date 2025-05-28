import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import colors from '@/constants/colors';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redireciona para a tela interna de redefinição de senha
  function handleForgotPassword() {
    router.push('/redefinir-senha');
  }

  async function handleLogin() {
    setLoading(true);
    try {
      if (!email || !password) {
        Alert.alert('Erro', 'Preencha email e senha.');
        setLoading(false);
        return;
      }
      // Login real com Supabase
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert('Erro', error.message || 'E-mail ou senha inválidos.');
        setLoading(false);
        return;
      }
      // Redireciona para a home após login
      router.replace('/(painel)/home');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    try {
      if (!email || !password) {
        Alert.alert('Erro', 'Preencha email e senha.');
        setLoading(false);
        return;
      }
      // Exemplo após o cadastro no Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        Alert.alert('Erro', error.message);
        setLoading(false);
        return;
      }

      // Agora insere na tabela customizada
      if (!data.user) {
        Alert.alert('Erro', 'Usuário criado, mas dados do usuário não retornados.');
        setLoading(false);
        return;
      }
      const { error: userTableError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, email }]); // NÃO envie senha!

      if (userTableError) {
        Alert.alert('Erro', 'Usuário criado no login, mas não salvo na tabela de usuários: ' + userTableError.message);
        setLoading(false);
        return;
      }

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={{ color: colors.green }}>PDV MOBILE</Text>
        </Text>
        <Text style={styles.slogan}>
          Faça seu login
        </Text>
      </View>
      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            value={email}
            onChangeText={setEmail}
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
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </Pressable>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Text>
        </Pressable>

        <Text style={styles.signupText}>Ainda não tem uma conta?</Text>
        <Link href="/signup/page" style={styles.link}>
          <Text style={styles.linkText}>Cadastre-se</Text>
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
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 34,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textLight,
  },
  link: {
    marginTop: 8,
    alignSelf: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});