import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Produto } from '@/types';
import { produtoService } from '@/services/supabase';
import colors from '@/constants/colors';

type ProdutoSearchProps = {
  onSelect: (produto: Produto) => void;
};

export default function ProdutoSearch({ onSelect }: ProdutoSearchProps) {
  const [termo, setTermo] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarProdutos = async (busca: string) => {
    setTermo(busca);
    if (busca.length < 2) {
      setProdutos([]);
      return;
    }

    try {
      setCarregando(true);
      const resultados = await produtoService.buscar(busca);
      setProdutos(resultados);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSelect = (produto: Produto) => {
    onSelect(produto);
    setTermo('');
    setProdutos([]);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar produto..."
        value={termo}
        onChangeText={buscarProdutos}
        leftIcon={<FontAwesome name="search" size={24} color={colors.textLight} />}
        loading={carregando}
      />
      {produtos.length > 0 && (
        <View style={styles.resultados}>
          {produtos.map((produto) => (
            <ListItem
              key={produto.id}
              bottomDivider
              onPress={() => handleSelect(produto)}
            >
              <FontAwesome name="cube" size={24} color={colors.textLight} />
              <ListItem.Content>
                <ListItem.Title>{produto.nome}</ListItem.Title>
                <ListItem.Subtitle>
                  R$ {produto.preco.toFixed(2)} - Estoque: {produto.estoque}
                </ListItem.Subtitle>
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