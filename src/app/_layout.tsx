import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import colors from "@/constants/colors";
import { supabase } from "../lib/supabase";
import { AuthProvider , useAuth} from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      
        <MainLayout />
    
    </AuthProvider>
  );
}


 function  MainLayout() {
const {setAuth} = useAuth();
useEffect(() => {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setAuth(session.user);
      router.replace('/profile/page');
      return;
    } 
    setAuth(null);
    router.replace('/signin/page');
  })
},[])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin/page" />
      <Stack.Screen name="signup/page" />
      <Stack.Screen name="(painel)" />
      <Stack.Screen name="profile/page" /> 
      <Stack.Screen name="app-test" />
      <Stack.Screen name="home-test" />
      <Stack.Screen name="redefinir-senha" />
    </Stack>
  );
}