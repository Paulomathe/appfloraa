import React, { createContext, useContext, useState } from 'react';

export type Empresa = {
  id: string;
  cnpj: string;
  nome: string;
};

type EmpresaContextType = {
  empresa: Empresa | null;
  setEmpresa: (empresa: Empresa | null) => void;
};

const EmpresaContext = createContext<EmpresaContextType>({
  empresa: null,
  setEmpresa: () => {},
});

export function EmpresaProvider({ children }: { children: React.ReactNode }) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  return (
    <EmpresaContext.Provider value={{ empresa, setEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  return useContext(EmpresaContext);
} 