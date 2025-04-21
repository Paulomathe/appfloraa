import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Card } from '@rneui/themed';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { supaUrl } from '@/constants/supabase';

export default function Configuracoes() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title>Informações do Usuário</Card.Title>
        <Card.Divider />
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{user?.user_metadata?.name || 'Não informado'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>ID do Usuário:</Text>
          <Text style={styles.value}>{user?.id}</Text>
        </View>
      </Card>

      <Card>
        <Card.Title>Informações do Sistema</Card.Title>
        <Card.Divider />
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>URL da API:</Text>
          <Text style={styles.value}>{supaUrl}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Versão do App:</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoContainer: {
    marginBottom: 12,
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