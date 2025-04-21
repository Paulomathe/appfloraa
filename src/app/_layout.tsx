import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import colors from "@/constants/colors";
import { supabase } from "../lib/supabase";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function MainLayout() {
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        router.replace('/(painel)/home');
        return;
      }
      setAuth(null);
      router.replace('/signin/page');
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signin/page" options={{ headerShown: false }} />
      <Stack.Screen name="signup/page" options={{ headerShown: false }} />
      <Stack.Screen name="(painel)" options={{ headerShown: false }} />
      <Stack.Screen name="profile/page" options={{ headerShown: false }} />
    </Stack>
  );
}