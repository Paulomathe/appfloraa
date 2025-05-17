import { useState } from 'react';
import { ToastAndroid, Platform, Alert } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastParams = {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
};

export function useToast() {
  // No iOS, usamos Alert
  // No Android, usamos ToastAndroid
  // No Web, poderíamos usar alguma biblioteca externa
  
  const show = ({ title, message, type = 'info', duration = 3000 }: ToastParams) => {
    if (Platform.OS === 'android') {
      // No Android, usamos o ToastAndroid nativo
      ToastAndroid.showWithGravity(
        title ? `${title}: ${message}` : message,
        duration === 3000 ? ToastAndroid.LONG : ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (Platform.OS === 'ios') {
      // No iOS, usamos Alert como alternativa
      Alert.alert(
        title || (type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : 'Aviso'),
        message,
        [{ text: 'OK' }]
      );
    } else {
      // No Web, poderíamos usar alguma biblioteca externa ou implementar um toast próprio
      console.log(`[${type.toUpperCase()}] ${title ? title + ': ' : ''}${message}`);
    }
  };
  
  // Métodos de conveniência
  const success = (params: Omit<ToastParams, 'type'>) => {
    show({ ...params, type: 'success' });
  };
  
  const error = (params: Omit<ToastParams, 'type'>) => {
    show({ ...params, type: 'error' });
  };
  
  const info = (params: Omit<ToastParams, 'type'>) => {
    show({ ...params, type: 'info' });
  };
  
  const warning = (params: Omit<ToastParams, 'type'>) => {
    show({ ...params, type: 'warning' });
  };
  
  return {
    show,
    success,
    error,
    info,
    warning
  };
} 