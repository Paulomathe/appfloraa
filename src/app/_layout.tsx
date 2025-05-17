import { router, Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import colors from "@/constants/colors";
import { supabase } from "../lib/supabase";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { EmpresaProvider, useEmpresa } from "../contexts/EmpresaContext";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Verificação para detectar problemas com as biblitecas
const checkLibraryCompatibility = () => {
  try {
    // Verificar se conseguimos importar os componentes básicos do RNE
    const rne = require('@rneui/themed');
    const Button = rne.Button;
    const Input = rne.Input;
    
    if (!Button || !Input) {
      console.warn('Componentes básicos do React Native Elements não encontrados');
    } else {
      console.log('React Native Elements carregado com sucesso');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao carregar bibliotecas:', error);
    return false;
  }
};

export default function RootLayout() {
  // Verificar compatibilidade logo na inicialização
  React.useEffect(() => {
    checkLibraryCompatibility();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <EmpresaProvider>
            <MainLayout />
          </EmpresaProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function MainLayout() {
  const { user, loading } = useAuth();
  const { empresa } = useEmpresa();
  const initialRedirectDone = useRef(false);

  useEffect(() => {
    if (loading || initialRedirectDone.current) return;

    if (user) {
      initialRedirectDone.current = true;
      router.replace('/profile/page');
    } else {
      initialRedirectDone.current = true;
      router.replace('/signin/page');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin/page" />
      <Stack.Screen name="signup/page" />
      <Stack.Screen name="(painel)" />
      <Stack.Screen name="(profile)/page" />
      <Stack.Screen name="selecionar-filial" />
      <Stack.Screen name="app-test" />
      <Stack.Screen name="home-test" />
      <Stack.Screen name="redefinir-senha" />
    </Stack>
  );
}