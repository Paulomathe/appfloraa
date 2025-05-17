import { useState, useEffect, useCallback } from 'react';
import { SchemaHelper } from '@/helpers/schemaHelper';
import { supabase } from '@/lib/supabase';

/**
 * Hook para utilizar o sistema multi-tenant em componentes React
 */
export function useMultiTenant() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empresaAtual, setEmpresaAtual] = useState<{
    id: string;
    nome: string;
    schema: string;
  } | null>(null);
  const [empresasDisponiveis, setEmpresasDisponiveis] = useState<Array<{
    id: string;
    nome: string;
    cnpj: string;
  }>>([]);

  // Inicializar o helper
  const initializeSchema = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await SchemaHelper.initialize();
      if (!success) {
        setError('Não foi possível inicializar o schema da empresa');
        return;
      }

      // Obter empresa atual
      const empresaId = SchemaHelper.getCurrentEmpresaId();
      const schemaName = SchemaHelper.getCurrentSchema();
      
      if (empresaId && schemaName) {
        const { data: empresa } = await supabase
          .from('empresas')
          .select('id, nome')
          .eq('id', empresaId)
          .single();
          
        if (empresa) {
          setEmpresaAtual({
            id: empresa.id,
            nome: empresa.nome,
            schema: schemaName
          });
        }
      }
      
      setInitialized(true);
    } catch (err) {
      console.error('Erro ao inicializar multi-tenant:', err);
      setError('Erro ao inicializar: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar empresas disponíveis
  const carregarEmpresasDisponiveis = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Buscar empresas que o usuário tem acesso
      const { data: vinculos } = await supabase
        .from('usuarios_empresas')
        .select('empresa_id')
        .eq('user_id', user.id);
        
      if (!vinculos?.length) return;
      
      // Buscar detalhes das empresas
      const empresasIds = vinculos.map(v => v.empresa_id);
      const { data: empresas } = await supabase
        .from('empresas')
        .select('id, nome, cnpj')
        .in('id', empresasIds);
        
      if (empresas?.length) {
        setEmpresasDisponiveis(empresas);
      }
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  }, []);

  // Trocar de empresa
  const trocarEmpresa = useCallback(async (empresaId: string) => {
    setLoading(true);
    try {
      const success = await SchemaHelper.switchSchema(empresaId);
      if (!success) {
        setError('Não foi possível trocar para esta empresa');
        return false;
      }
      
      // Atualizar empresa atual
      const { data: empresa } = await supabase
        .from('empresas')
        .select('id, nome, schema_nome')
        .eq('id', empresaId)
        .single();
        
      if (empresa) {
        setEmpresaAtual({
          id: empresa.id,
          nome: empresa.nome,
          schema: empresa.schema_nome
        });
      }
      
      return true;
    } catch (err) {
      console.error('Erro ao trocar empresa:', err);
      setError('Erro ao trocar empresa: ' + (err instanceof Error ? err.message : String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar query para tabela no schema atual
  const query = useCallback((tableName: string) => {
    if (!initialized) {
      throw new Error('O sistema multi-tenant não foi inicializado');
    }
    return SchemaHelper.table(tableName);
  }, [initialized]);

  // Inicializar ao montar o componente
  useEffect(() => {
    initializeSchema();
    carregarEmpresasDisponiveis();
  }, [initializeSchema, carregarEmpresasDisponiveis]);

  return {
    initialized,
    loading,
    error,
    empresaAtual,
    empresasDisponiveis,
    trocarEmpresa,
    query,
    reinicializar: initializeSchema
  };
} 