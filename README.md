# PDV App (Flora App)

Aplicativo de ponto de venda (PDV) para gestão de vendas, produtos, serviços, clientes e vendedores, desenvolvido em **React Native** com **Expo Router** e integração com **Supabase**.

## Funcionalidades

- Cadastro e gerenciamento de produtos, serviços, clientes e vendedores
- Registro e acompanhamento de vendas
- Busca rápida por produtos, serviços, clientes e vendedores
- Autenticação de usuários
- Interface adaptável ao tema do sistema (claro/escuro)
- Navegação moderna com Expo Router
- Ícones personalizados e design responsivo

## Tecnologias Utilizadas

- [Expo](https://expo.dev/) (~52.0.46)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/) (~4.0.21)
- [React Native Elements](https://reactnativeelements.com/) (`@rneui/themed`)
- [Supabase](https://supabase.com/) (backend e autenticação)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) (~2.20.2)

## Instalação

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/Paulomathe/appfloraa.git
   cd appfloraa
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   # ou
   yarn install
   ```

3. **Configure o Supabase:**
   - Renomeie `.env.example` para `.env` e preencha com suas chaves do Supabase.
   ```
   SUPABASE_URL=coloque_sua_url_aqui
   SUPABASE_ANON_KEY=coloque_sua_chave_aqui
   ```

4. **Execute o projeto:**
   ```sh
   npx expo start
   ```

## Estrutura de Pastas

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

## Observações

- O ícone do app deve estar em `assets/images/iconeApp.png` (recomendado 1024x1024px, sem textos).
- O splash screen está em `assets/images/loading.png`.
- Para personalizar temas, edite `src/constants/colors.ts`.

## Licença

Este projeto está sob a licença MIT.

---

Desenvolvido por [Seu Nome ou Equipe] 🚀
