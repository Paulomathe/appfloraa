import { supabase } from '@/lib/supabase';

/**
 * Helper para gerenciar schemas de empresas diferentes
 */
export class SchemaHelper {
  private static currentSchemaName: string | null = null;
  private static currentEmpresaId: string | null = null;

  /**
   * Inicializa o helper carregando o schema atual do usuário
   */
  static async initialize(): Promise<boolean> {
    try {
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Buscar a empresa atual do usuário
      const { data: vinculo, error } = await supabase
        .from('usuarios_empresas')
        .select('empresa_id')
        .eq('user_id', user.id)
        .single();

      if (error || !vinculo) return false;

      // Obter o nome do schema
      const { data: empresa } = await supabase
        .from('empresas')
        .select('schema_nome, nome')
        .eq('id', vinculo.empresa_id)
        .single();

      if (!empresa || !empresa.schema_nome) return false;

      this.currentSchemaName = empresa.schema_nome;
      this.currentEmpresaId = vinculo.empresa_id;
      
      console.log(`Schema inicializado: ${this.currentSchemaName} (${empresa.nome})`);
      return true;
    } catch (error) {
      console.error('Erro ao inicializar schema:', error);
      return false;
    }
  }

  /**
   * Retorna o nome do schema atual
   */
  static getCurrentSchema(): string | null {
    return this.currentSchemaName;
  }

  /**
   * Retorna o ID da empresa atual
   */
  static getCurrentEmpresaId(): string | null {
    return this.currentEmpresaId;
  }

  /**
   * Cria uma query para a tabela no schema atual
   */
  static table(tableName: string) {
    if (!this.currentSchemaName) {
      throw new Error('Schema não inicializado. Chame SchemaHelper.initialize() primeiro.');
    }

    // Construir nome da tabela com o schema
    const fullTableName = `${this.currentSchemaName}.${tableName}`;
    
    // Retornar objeto de query do Supabase
    return supabase.from(fullTableName);
  }

  /**
   * Executa uma consulta SQL com o schema atual
   */
  static async executeRpc(functionName: string, params: any = {}) {
    // Adiciona o schema atual aos parâmetros
    const paramsWithSchema = {
      ...params,
      schema_name: this.currentSchemaName
    };

    return supabase.rpc(functionName, paramsWithSchema);
  }
  
  /**
   * Troca o schema atual (se o usuário tiver acesso a múltiplas empresas)
   */
  static async switchSchema(empresaId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Verificar se o usuário tem acesso a esta empresa
      const { data: vinculo, error } = await supabase
        .from('usuarios_empresas')
        .select('*')
        .eq('user_id', user.id)
        .eq('empresa_id', empresaId)
        .single();

      if (error || !vinculo) return false;

      // Obter o nome do schema
      const { data: empresa } = await supabase
        .from('empresas')
        .select('schema_nome, nome')
        .eq('id', empresaId)
        .single();

      if (!empresa || !empresa.schema_nome) return false;

      this.currentSchemaName = empresa.schema_nome;
      this.currentEmpresaId = empresaId;
      
      console.log(`Schema alterado: ${this.currentSchemaName} (${empresa.nome})`);
      return true;
    } catch (error) {
      console.error('Erro ao alterar schema:', error);
      return false;
    }
  }
} 