import React, { useState } from 'react';
import { Modal, View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Option = { id: string; nome: string };

interface Props {
  visible: boolean;
  options: Option[];
  onSelect: (option: Option) => void;
  onClose: () => void;
  title: string;
}

export default function SelectModal({ visible, options, onSelect, onClose, title }: Props) {
  const [search, setSearch] = useState('');

  const filtered = options.filter(opt =>
    opt.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Pesquisar ${title.toLowerCase()}...`}
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { onSelect(item); onClose(); }}>
                <Text style={styles.option}>{item.nome}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Nenhum resultado encontrado</Text>}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#fff', margin: 32, borderRadius: 8, padding: 16, maxHeight: '80%' },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8 },
  option: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  close: { color: 'red', textAlign: 'center', marginTop: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 16 }
});