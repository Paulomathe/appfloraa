import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Importar apenas componentes essenciais e verificados
import { Button, Input } from '@rneui/themed';
import colors from '@/constants/colors';

// Componente de teste para verificar se a biblioteca @rneui/themed está funcionando
export default function AppTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Componentes</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Card de Teste</Text>
        <View style={styles.divider} />
        <Text style={styles.paragraph}>
          Este é um teste para verificar se os componentes do React Native Elements estão funcionando corretamente.
        </Text>
        <Input 
          placeholder="Digite algo aqui"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          containerStyle={styles.inputContainer}
        />
        <Button
          title="Botão de Teste"
          containerStyle={styles.buttonContainer}
          buttonStyle={{ backgroundColor: colors.primary }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 16,
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
}); 