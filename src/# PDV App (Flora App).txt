# PDV App (Flora App)

Aplicativo de ponto de venda (PDV) para gestão de vendas, produtos, serviços, clientes e vendedores, desenvolvido em **React Native** com **Expo Router** e integração com **Supabase**.

---

## 🚀 Como executar o projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado v18 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)  
  Instale com:  
  ```
  npm install -g expo-cli
  ```
- Celular Android ou emulador Android
- Conta gratuita no [Supabase](https://supabase.com/) (para backend e autenticação)

---

### 2. Clonar o repositório

```sh
git clone https://github.com/seu-usuario/appflora.git
cd appfloraa
```

---

### 3. Instalar as dependências

```sh
npm install
# ou
yarn install
```

---

### 4. Configurar o Supabase

- Renomeie o arquivo `.env.example` para `.env` (se existir).
- Preencha as variáveis com as chaves do seu projeto Supabase.
- Caso não exista `.env.example`, edite diretamente o arquivo de configuração em `src/constants/supabase.ts` com sua URL e chave anônima do Supabase.

---

### 5. Rodar o projeto no Android (modo desenvolvimento)

```sh
npx expo start
```

- Escaneie o QR Code com o aplicativo **Expo Go** no seu celular Android  
  **OU**  
- Pressione `a` no terminal para abrir no emulador Android.

---

### 6. Gerar APK para instalar manualmente (sem publicar)

Se quiser gerar um APK para instalar no seu celular:

1. Instale o EAS CLI:
   ```
   npm install -g eas-cli
   ```

2. Configure o EAS Build:
   ```
   eas build:configure
   ```

3. Gere o APK:
   ```
   eas build -p android --profile preview
   ```
   - Escolha a opção APK quando solicitado.
   - Após o build, baixe o arquivo APK pelo link exibido no terminal.

4. Instale o APK no seu celular.

---

## 📁 Estrutura de Pastas

```
src/
  app/
    (painel)/        # Telas do painel principal
    profile/         # Tela de perfil do usuário
    signin/          # Tela de login
    signup/          # Tela de cadastro
    _index.tsx       # Tela inicial
    _layout.tsx      # Layout global
  components/        # Componentes reutilizáveis
  contexts/          # Contextos de autenticação e outros
  constants/         # Cores e estilos globais
  lib/               # Integração com Supabase
assets/
  images/            # Imagens e ícones do app
```

---

## 📝 Observações

- O ícone do app está em `assets/images/iconeApp.png` (recomendado 1024x1024px).
- O splash screen está em `assets/images/loading.png`.
- Para personalizar temas, edite `src/constants/colors.ts`.

---

## 🛠️ Tecnologias Utilizadas

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [React Native Elements](https://reactnativeelements.com/) (`@rneui/themed`)
- [Supabase](https://supabase.com/)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido por Paulo Matheus Avelino de Jesus 
