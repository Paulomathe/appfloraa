import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, ListItem } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { Cliente } from '@/types';
import { clienteService } from '@/services/supabase';
import colors from '@/constants/colors';

type Props = {
  onSelect: (cliente: Cliente) => void;
};

export function ClienteSearch({ onSelect }: Props) {
  const [termo, setTermo] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(false);

  async function buscarClientes(busca: string) {
    setTermo(busca);
    
    if (busca.length < 2) {
      setClientes([]);
      return;
    }

    try {
      setCarregando(true);
      const data = await clienteService.buscar(busca);
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setClientes([]);
    } finally {
      setCarregando(false);
    }
  }

  function handleSelect(cliente: Cliente) {
    onSelect(cliente);
    setTermo('');
    setClientes([]);
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar cliente..."
        value={termo}
        onChangeText={buscarClientes}
        leftIcon={<MaterialIcons name="search" size={24} color="gray" />}
        disabled={carregando}
      />

      {clientes.map((cliente) => (
        <ListItem key={cliente.id} onPress={() => handleSelect(cliente)} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{cliente.nome}</ListItem.Title>
            <ListItem.Subtitle>{cliente.telefone}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative' as const,
    zIndex: 1
  },
  resultados: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
}); 