import {View,Text,StyleSheet, Button, Alert} from 'react-native';
import React from 'react';
import { supabase } from  '../../lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';


export default function Profile() {  
  const {setAuth,user} = useAuth(); 
async function handleSingout (){
  setAuth(null);
    const { error } = await supabase.auth.signOut();
    if(error){
        Alert.alert('Erro', 'Erro ao sair da conta, tente mais tarde') 
        return;
    }
}
  return (
    <View  style={styles.container}>
        <Text >Pagina Perfil</Text>
        <Text >{user?.email}</Text>
        <Text >{user?.user_metadata.name}</Text>
        <Button
            title="Deslogar"
            onPress={handleSingout}>
        </Button>


    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
  
});