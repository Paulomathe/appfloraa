import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import colors from '@/constants/colors';

export default function Profile() {  
  const { setAuth, user } = useAuth(); 

  async function handleSignout() {
    try {
      await supabase.auth.signOut();
      setAuth(null);
      router.replace('/signin/page');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao sair da conta, tente mais tarde');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil do Usuário</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{user?.user_metadata?.name || 'Não informado'}</Text>
        </View>

        <Button
          title="Sair"
          onPress={handleSignout}
          color={colors.error}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
});