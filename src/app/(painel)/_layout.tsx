import { Drawer } from 'expo-router/drawer';
import { FontAwesome } from '@expo/vector-icons';
import colors from "@/constants/colors";
import { Alert, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useEffect, useRef } from 'react';
import { SwitchEmpresa } from '@/components/SwitchEmpresa';
import { ProfileInfo } from '@/components/ProfileInfo';

type DrawerIconProps = {
  color: string;
  size: number;
};

export default function PainelLayout() {
  const { setAuth, user } = useAuth();
  const redirectRef = useRef(false);
  
  useEffect(() => {
    if (!user && !redirectRef.current) {
      redirectRef.current = true;
      router.replace('/signin/page');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAuth(null);
      router.replace('/signin/page');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer logout');
    }
  };

  function CustomDrawerContent(props: any) {
    const userName = user?.user_metadata?.name || 'Usuário';
    const userEmail = user?.email || '';
    const profileImage = user?.user_metadata?.avatar_url || null;

    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <ProfileInfo 
            name={userName}
            email={userEmail}
            avatarUrl={profileImage}
          />
          
          <SwitchEmpresa />

          <View style={styles.drawerSection}>
            <DrawerItemList {...props} />
            <View style={styles.logoutSection}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <FontAwesome name="sign-out" size={24} color={colors.error} style={{ marginRight: 32 }} />
                <Text style={{ color: colors.error, fontSize: 16 }}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.white,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: 'Vendas',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FontAwesome name="cube" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="servicos"
        options={{
          title: 'Serviços',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FontAwesome name="wrench" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="vendedores"
        options={{
          title: 'Vendedores',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FontAwesome name="user-secret" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FontAwesome name="cog" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Meu Perfil',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />

      {/* Telas modais */}
      <Drawer.Screen
        name="produtos/cadastrar"
        options={{
          title: 'Cadastrar Produto',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="servicos/cadastrar"
        options={{
          title: 'Cadastrar Serviço',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="vendedores/cadastrar"
        options={{
          title: 'Cadastrar Vendedor',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="clientes/cadastrar"
        options={{
          title: 'Cadastrar Cliente',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="nova-venda"
        options={{
          title: 'Nova Venda',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="vendas/detalhes"
        options={{
          title: 'Detalhes da Venda',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerSection: {
    flex: 1,
    marginTop: 8,
  },
  logoutSection: {
    borderTopWidth: 1, 
    borderTopColor: colors.border,
    marginTop: 'auto',
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  }
}); 