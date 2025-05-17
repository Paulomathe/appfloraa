import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react"; 
import { supabase } from "@/lib/supabase";

interface AuthContextProps { 
  user: User | null;
  loading: boolean;
  setAuth: (user: User | null) => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca usuário autenticado ao iniciar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function setAuth(authuser: User | null) {
    setUser(authuser);
  }

  return (
    <AuthContext.Provider value={{user, loading, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);