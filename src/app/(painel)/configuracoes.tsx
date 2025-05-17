import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Card, Button, Input } from '@rneui/themed';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresa, Empresa } from '@/contexts/EmpresaContext';
import { supabase } from '@/lib/supabase';
import { supaUrl } from '@/constants/supabase';

export default function Configuracoes() {
  const { user, setAuth } = useAuth();
  const { empresa, setEmpresa } = useEmpresa();

  // Estados para edição de usuário
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [salvando, setSalvando] = useState(false);

  // Empresas do usuário
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(true);

  // Novo CNPJ
  const [novoCnpj, setNovoCnpj] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    setNome(user?.user_metadata?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  useEffect(() => {
    async function fetchEmpresas() {
      setCarregandoEmpresas(true);
      const { data, error } = await supabase
        .from('usuarios_empresas')
        .select('empresa:empresa_id(id,cnpj,nome)')
        .eq('user_id', user?.id);
      if (!error && data) setEmpresas(data.map((item: any) => item.empresa));
      setCarregandoEmpresas(false);
    }
    if (user) fetchEmpresas();
  }, [user, adicionando]);

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
          id: user.id // garante que id nunca é undefined
        });
      }
      Alert.alert('Sucesso', 'Dados atualizados!');
    }
  }

  async function adicionarEmpresa() {
    if (!novoCnpj.trim() || !novoNome.trim()) {
      Alert.alert('Erro', 'Preencha o CNPJ e o nome da empresa.');
      return;
    }
    setAdicionando(true);
    // Cria empresa se não existir
    let { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .eq('cnpj', novoCnpj)
      .single();
    let empresaId = empresa?.id;
    if (!empresa && !empresaError) {
      const { data: novaEmpresa, error: erroCriarEmpresa } = await supabase
        .from('empresas')
        .insert([{ cnpj: novoCnpj, nome: novoNome }])
        .select()
        .single();
      if (erroCriarEmpresa) {
        Alert.alert('Erro', 'Erro ao criar empresa: ' + erroCriarEmpresa.message);
        setAdicionando(false);
        return;
      }
      empresaId = novaEmpresa.id;
    } else if (empresaError && empresaError.code !== 'PGRST116') {
      Alert.alert('Erro', 'Erro ao buscar empresa: ' + empresaError.message);
      setAdicionando(false);
      return;
    }
    // Associa usuário à empresa
    const { error: assocError } = await supabase
      .from('usuarios_empresas')
      .insert([{ user_id: user?.id, empresa_id: empresaId }]);
    setAdicionando(false);
    if (assocError) {
      Alert.alert('Erro', 'Empresa criada, mas não foi possível associar: ' + assocError.message);
    } else {
      setNovoCnpj('');
      setNovoNome('');
      Alert.alert('Sucesso', 'Empresa adicionada!');
    }
  }

  function trocarFilial(filial: Empresa) {
    setEmpresa(filial);
    Alert.alert('Filial selecionada', `Agora você está usando a filial: ${filial.nome}`);
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
        <Card.Title>Empresas (Filiais)</Card.Title>
        <Card.Divider />
        {carregandoEmpresas ? (
          <Text>Carregando...</Text>
        ) : (
          empresas.map((e) => (
            <View key={e.id} style={styles.empresaItem}>
              <Text style={styles.value}>{e.nome} - {e.cnpj}</Text>
              <Button
                title={empresa?.id === e.id ? 'Selecionada' : 'Usar'}
                type={empresa?.id === e.id ? 'solid' : 'outline'}
                onPress={() => trocarFilial(e)}
                buttonStyle={styles.button}
                disabled={empresa?.id === e.id}
              />
            </View>
          ))
        )}
        <Input
          label="Novo CNPJ"
          value={novoCnpj}
          onChangeText={setNovoCnpj}
          placeholder="Digite o CNPJ"
        />
        <Input
          label="Nome da nova empresa"
          value={novoNome}
          onChangeText={setNovoNome}
          placeholder="Digite o nome"
        />
        <Button
          title={adicionando ? 'Adicionando...' : 'Adicionar nova empresa'}
          onPress={adicionarEmpresa}
          loading={adicionando}
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
  empresaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
}); 