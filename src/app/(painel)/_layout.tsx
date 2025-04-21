import { Drawer } from 'expo-router/drawer';
import { FontAwesome } from '@expo/vector-icons';
import colors from "@/constants/colors";
import { Alert, TouchableOpacity, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

type DrawerIconProps = {
  color: string;
  size: number;
};

export default function PainelLayout() {
  const { setAuth } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              setAuth(null);
              router.replace('/signin/page');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  function CustomDrawerContent(props: any) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <View style={{ 
          borderTopWidth: 1, 
          borderTopColor: colors.border,
          marginTop: 'auto',
          paddingTop: 16
        }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
            onPress={handleLogout}
          >
            <FontAwesome name="sign-out" size={24} color={colors.error} style={{ marginRight: 32 }} />
            <Text style={{ color: colors.error, fontSize: 16 }}>Sair</Text>
          </TouchableOpacity>
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