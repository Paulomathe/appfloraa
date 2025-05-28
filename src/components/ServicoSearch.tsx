import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Servico } from '@/types';
import { servicoService } from '@/services/supabase';
import colors from '@/constants/colors';

type ServicoSearchProps = {
  onSelect: (servico: Servico) => void;
};

export default function ServicoSearch({ onSelect }: ServicoSearchProps) {
  const [termo, setTermo] = useState('');
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarServicos = async (busca: string) => {
    setTermo(busca);
    if (busca.length < 2) {
      setServicos([]);
      return;
    }

    try {
      setCarregando(true);
      const resultados = await servicoService.buscar(busca);
      setServicos(resultados);
    } catch (error) {
      setServicos([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSelect = (servico: Servico) => {
    onSelect(servico);
    setTermo('');
    setServicos([]);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar serviço..."
        value={termo}
        onChangeText={buscarServicos}
        leftIcon={<FontAwesome name="wrench" size={24} color={colors.textLight} />}
      />
     {servicos.map((servico) => (
  <ListItem
    key={servico.id}
    bottomDivider
    onPress={() => handleSelect(servico)}
  >
    <FontAwesome name="wrench" size={24} color={colors.textLight} />
    <ListItem.Content>
      <ListItem.Title>{servico.nome}</ListItem.Title>
      <ListItem.Subtitle>
        R$ {servico.preco.toFixed(2)}
      </ListItem.Subtitle>
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