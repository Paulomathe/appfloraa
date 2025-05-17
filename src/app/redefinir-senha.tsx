import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import colors from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function RedefinirSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const validar = () => {
    setErro('');
    setSucesso('');
    if (!email.trim()) {
      setErro('Informe o e-mail.');
      return false;
    }
    return true;
  };

  const handleRedefinir = async () => {
    if (!validar()) return;
    setLoading(true);
    setErro('');
    setSucesso('');
    try {
      // Envia o e-mail de redefinição de senha pelo Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        if (
          error.message.toLowerCase().includes('invalid') ||
          error.message.toLowerCase().includes('not found')
        ) {
          setErro('E-mail não encontrado. Verifique se digitou corretamente ou cadastre-se.');
        } else {
          setErro(error.message || 'Erro ao solicitar redefinição.');
        }
        return;
      }
      setSucesso('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setErro(err.message || 'Erro ao solicitar redefinição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.logoText}><Text style={{ color: colors.green }}>PDV MOBILE</Text></Text>
        <Text style={styles.slogan}>Redefinir Senha</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor={colors.textLight}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {erro ? <Text style={{ color: colors.error, marginBottom: 8, textAlign: 'center' }}>{erro}</Text> : null}
        {sucesso ? <Text style={{ color: colors.success, marginBottom: 8, textAlign: 'center' }}>{sucesso}</Text> : null}
        <Button
          title={loading ? 'Enviando...' : 'Enviar e-mail de redefinição'}
          onPress={handleRedefinir}
          buttonStyle={styles.button}
          loading={loading}
          disabled={loading}
        />
        <Pressable style={{ alignSelf: 'center', marginTop: 16 }} onPress={() => router.replace('/signin/page')}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Voltar ao login</Text>
        </Pressable>
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
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
});