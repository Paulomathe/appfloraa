import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import colors from '@/constants/colors';
import React from 'react';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setILoading] = React.useState(false);
  const { setAuth } = useAuth();

  async function handleLogin() {
    setILoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert('Erro', error.message);
      setILoading(false);
      return;
    }
    setAuth(data.user);
    setILoading(false);
    router.replace('/(painel)/home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Dev<Text style={{ color: colors.green }}>App</Text>
        </Text>
        <Text style={styles.slogan}>Floricultura</Text>
      </View>
      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor={colors.white}
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
            placeholderTextColor={colors.white}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Text>
        </Pressable>
        <Link href="/signup/page" style={styles.link}>
          <Text>Ainda não tem uma conta? Cadastre-se</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: colors.zinc,
    alignItems: 'center',
  },
  header: {
    paddingLeft: 14,
    paddingRight: 14,
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
    paddingLeft: 14,
    paddingRight: 14,
  },
  label: {
    color: colors.zinc,
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.green,
    width: '100%',
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.zinc,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
    color: colors.zinc,
  },
}); 