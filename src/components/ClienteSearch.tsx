import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons'; // Troque MaterialIcons por FontAwesome
import { Cliente } from '@/types';
import { clienteService } from '@/services/supabase';
import colors from '@/constants/colors';

type Props = {
  onSelect: (cliente: Cliente) => void;
  value?: string;
};

export function ClienteSearch({ onSelect, value }: Props) {
  const [termo, setTermo] = useState(value || '');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    if (!isTyping && value !== undefined) setTermo(value);
    // eslint-disable-next-line
  }, [value]);

  async function buscarClientes(busca: string) {
    setIsTyping(true);
    setTermo(busca);

    if (busca.length < 2) {
      setClientes([]);
      setIsTyping(false);
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
      setIsTyping(false);
    }
  }

  function handleSelect(cliente: Cliente) {
    onSelect(cliente);
    setTermo(cliente.nome);
    setClientes([]);
    setIsTyping(false);
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar cliente..."
        value={termo}
        onChangeText={buscarClientes}
        leftIcon={<FontAwesome name="user" size={24} color={colors.textLight} />} // <-- Aqui está o ícone igual ao da tela de clientes
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
    position: 'relative',
    zIndex: 100, // aumente aqui
  },
  resultados: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 20, // aumente para Android
    zIndex: 200,   // aumente para garantir sobreposição
    maxHeight: 220,
    marginTop: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});