import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Vendedor } from '@/types';
import { vendedorService } from '@/services/supabase';
import colors from '@/constants/colors';

type VendedorSearchProps = {
  onSelect: (vendedor: Vendedor) => void;
  value?: string;
};

export default function VendedorSearch({ onSelect, value }: VendedorSearchProps) {
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
        leftIcon={<FontAwesome name="user-secret" size={24} color={colors.textLight} />}
      />
      {vendedores.length > 0 && (
        <View style={styles.resultados}>
          {vendedores.map((vendedor) => (
            <ListItem
              key={vendedor.id}
              bottomDivider
              onPress={() => handleSelect(vendedor)}
            >
              <FontAwesome name="user-secret" size={24} color={colors.textLight} />
              <ListItem.Content>
                <ListItem.Title>{vendedor.nome}</ListItem.Title>
                <ListItem.Subtitle>Comissão: {vendedor.comissao}%</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
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