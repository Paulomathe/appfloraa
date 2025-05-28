import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native'; // Adicione Image aqui
import { Input, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Vendedor } from '@/types';
import { vendedorService } from '@/services/supabase';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';

type VendedorSearchProps = {
  onSelect: (vendedor: Vendedor) => void;
  value?: string;
};

export default function VendedorSearch(props: VendedorSearchProps) {
  const { onSelect, value } = props;
  const [termo, setTermo] = useState(value || '');
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarVendedores = async (busca: string) => {
    setTermo(busca);
    if (busca.length < 2) {
      setVendedores([]);
      return;
    }

    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('vendedores')
        .select('*')
        .ilike('nome', `%${busca}%`)
        .order('nome')
        .limit(10);

      if (error) throw error;
      setVendedores(data);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      setVendedores([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSelect = (vendedor: Vendedor) => {
    onSelect(vendedor);
    setTermo(vendedor.nome);
    setVendedores([]);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar vendedor..."
        value={termo}
        onChangeText={buscarVendedores}
        leftIcon={
          <Image
            source={require('../../assets/images/vendedor.png')}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        }
      />
      {vendedores.map((vendedor) => (
        <ListItem
          key={vendedor.id}
          bottomDivider
          onPress={() => handleSelect(vendedor)}
        >
          <Image
            source={require('../../assets/images/vendedor.png')}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <ListItem.Content>
            <ListItem.Title>{vendedor.nome}</ListItem.Title>
            <ListItem.Subtitle>Comissão: {vendedor.comissao}%</ListItem.Subtitle>
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