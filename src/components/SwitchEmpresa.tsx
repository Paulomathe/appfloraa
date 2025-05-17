import React, { useState } from 'react';
import { Text, TouchableOpacity, Modal, View, FlatList, StyleSheet } from 'react-native';
import { useMultiTenant } from '@/hooks/useMultiTenant';
import { MaterialIcons } from '@expo/vector-icons';
import { useToast } from '@/hooks/useToast';
import colors from '@/constants/colors';

type Empresa = {
  id: string;
  nome: string;
  cnpj: string;
};

export const SwitchEmpresa = () => {
  const { empresasDisponiveis, empresaAtual, trocarEmpresa, loading } = useMultiTenant();
  const [modalVisible, setModalVisible] = useState(false);
  const toast = useToast();

  // Se houver apenas uma empresa, não mostrar o componente
  if (empresasDisponiveis.length <= 1) {
    return null;
  }

  const handleEmpresaSelect = async (empresa: Empresa) => {
    // Se já é a empresa atual, apenas fechar o modal
    if (empresa.id === empresaAtual?.id) {
      setModalVisible(false);
      return;
    }

    const sucesso = await trocarEmpresa(empresa.id);
    setModalVisible(false);
    
    if (sucesso) {
      toast.show({
        title: 'Empresa alterada',
        message: `Agora você está utilizando a empresa ${empresa.nome}`,
        type: 'success'
      });
    } else {
      toast.show({
        title: 'Erro ao trocar empresa',
        message: 'Não foi possível alterar a empresa, tente novamente.',
        type: 'error'
      });
    }
  };

  const formatarCNPJ = (cnpj: string) => {
    if (!cnpj) return '';
    // Formatar CNPJ: XX.XXX.XXX/XXXX-XX
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.switcher}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        <Text style={styles.empresaAtual} numberOfLines={1}>
          {empresaAtual?.nome || 'Carregando...'}
        </Text>
        <MaterialIcons name="swap-horiz" size={20} color={colors.primary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Selecione uma empresa</Text>
            
            <FlatList
              data={empresasDisponiveis}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.empresaItem,
                    item.id === empresaAtual?.id && styles.empresaItemAtiva
                  ]}
                  onPress={() => handleEmpresaSelect(item)}
                >
                  <Text style={styles.empresaNome}>{item.nome}</Text>
                  {item.cnpj && (
                    <Text style={styles.empresaCnpj}>{formatarCNPJ(item.cnpj)}</Text>
                  )}
                  {item.id === empresaAtual?.id && (
                    <MaterialIcons name="check" size={18} color={colors.primary} style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.btnFechar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    maxWidth: '100%',
  },
  empresaAtual: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 8,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  empresaItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  empresaItemAtiva: {
    backgroundColor: 'rgba(0, 123, 255, 0.08)',
  },
  empresaNome: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  empresaCnpj: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  checkIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -9,
  },
  btnFechar: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnFecharTexto: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
}); 