import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresa, Empresa } from '@/contexts/EmpresaContext';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import { router } from 'expo-router';

export default function SelecionarFilial() {
  const { user } = useAuth();
  const { setEmpresa } = useEmpresa();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmpresas() {
      setLoading(true);
      const { data, error } = await supabase
        .from('usuarios_empresas')
        .select('empresa:empresa_id(id,cnpj,nome)')
        .eq('user_id', user?.id);
      if (error) {
        Alert.alert('Erro', 'Erro ao buscar filiais: ' + error.message);
        setLoading(false);
        return;
      }
      setEmpresas(data.map((item: any) => item.empresa));
      setLoading(false);
    }
    fetchEmpresas();
  }, [user]);

  function handleSelect(empresa: Empresa) {
    setEmpresa(empresa);
    router.replace('/(painel)/home');
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione a Filial</Text>
      <FlatList
        data={empresas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.cnpj}>CNPJ: {item.cnpj}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  item: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: 300,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nome: {
    fontSize: 18,
    color: colors.text,
    fontWeight: 'bold',
  },
  cnpj: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
}); 