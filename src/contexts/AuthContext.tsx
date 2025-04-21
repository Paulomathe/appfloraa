import { User } from "@supabase/supabase-js";
import { createContext, useContext,useState } from "react"; 

interface AuthContextprops { 
user: User | null;
setAuth: (user: User | null) => void;
}
const AuthContext = createContext ({} as AuthContextprops);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
const [user, setUser] = useState<User | null>(null);
function setAuth(authuser: User | null) {
    setUser(user);
  }
return (
<AuthContext.Provider value={{user, setAuth}}>
    {children}
</AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);