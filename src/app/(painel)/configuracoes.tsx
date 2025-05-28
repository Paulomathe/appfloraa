import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Card, Button, Input } from '@rneui/themed';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { supaUrl } from '@/constants/supabase';

export default function Configuracoes() {
  const { user, setAuth } = useAuth();

  // Estados para edição de usuário
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [salvando, setSalvando] = useState(false);

  async function salvarUsuario() {
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({
      email,
      data: { name: nome }
    });
    setSalvando(false);
    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setEditando(false);
      if (user) {
        setAuth({
          ...user,
          email,
          user_metadata: { ...user.user_metadata, name: nome },
          id: user.id
        });
      }
      Alert.alert('Sucesso', 'Dados atualizados!');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title>Informações do Usuário</Card.Title>
        <Card.Divider />
        <Input
          label="Nome"
          value={nome}
          onChangeText={setNome}
          disabled={!editando}
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          disabled={!editando}
        />
        <Text style={styles.label}>ID do Usuário:</Text>
        <Text style={styles.value}>{user?.id}</Text>
        <Button
          title={editando ? (salvando ? 'Salvando...' : 'Salvar') : 'Editar'}
          onPress={editando ? salvarUsuario : () => setEditando(true)}
          loading={salvando}
          buttonStyle={styles.button}
        />
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
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
  },
});