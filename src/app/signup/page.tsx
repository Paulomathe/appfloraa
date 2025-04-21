import {View,Text,StyleSheet, TextInput, Pressable, SafeAreaView, ScrollView,Alert} from 'react-native';
import colors from '@/constants/colors';
import React from 'react';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons'
import {Link} from 'expo-router';
import {supabase} from '@/lib/supabase';

export default function Signup() {     
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [loading, setILoading] = React.useState(false);

    async function handleSignup() {
        setILoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { 
                    name: name,
                },
            }       
        });
        if(error) {
            Alert.alert('Erro', error.message);
            setILoading(false);
            return;
        }
        setILoading(false);
        router.replace('/signin/page');
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso, faça login para continuar');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </Pressable>

                <Text style={styles.logoText}>
                    Dev<Text style={{color: colors.green}}>App</Text>
                </Text>
                <Text style={styles.slogan}>
                    Criar uma conta
                </Text>   
            </View>
            <View style={styles.form}>
                <View>
                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Nome completo..."
                        placeholderTextColor={colors.textLight}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                </View>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Digite seu email"
                        placeholderTextColor={colors.textLight}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        returnKeyType="next"
                    />
                </View>
                
                <View>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor={colors.textLight}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <Pressable style={styles.button} onPress={handleSignup} >
                    <Text style={styles.buttonText}>
                        {loading ? 'Carregando...' : 'Cadastrar'}
                    </Text>   
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 34,
        backgroundColor: colors.zinc,
    },
    header: {
        paddingLeft: 14,
        paddingRight: 14,
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    slogan: {
        fontSize: 34,
        color: colors.white,
        marginBottom: 34,
    },
    form: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 24,
        paddingHorizontal: 14,
    },
    label: {
        color: colors.zinc,
        marginBottom: 4,
    },
    input: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray,
        paddingHorizontal: 8,
        paddingVertical: 14,
        marginBottom: 16,
        color: colors.text,
    },
    button: {    
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        width: '100%',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        left: 14,
        top: 0,
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
}); 