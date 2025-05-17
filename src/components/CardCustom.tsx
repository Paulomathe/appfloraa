import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import colors from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  containerStyle?: ViewStyle;
}

interface CardTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

interface CardDividerProps {
  style?: ViewStyle;
}

const CardTitle = ({ children, style }: CardTitleProps) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const CardDivider = ({ style }: CardDividerProps) => {
  return <View style={[styles.divider, style]} />;
};

const CardCustom = ({ children, containerStyle }: CardProps) => {
  return (
    <View style={[styles.card, containerStyle]}>
      {children}
    </View>
  );
};

// Adicionar componentes como propriedades estáticas
CardCustom.Title = CardTitle;
CardCustom.Divider = CardDivider;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});

export default CardCustom; 