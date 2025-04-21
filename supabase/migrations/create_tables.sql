-- Criar tabela de clientes
CREATE TABLE clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de vendedores
CREATE TABLE vendedores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    comissao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de vendas
CREATE TABLE vendas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente TEXT NOT NULL,
    vendedor TEXT NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    data TIMESTAMP WITH TIME ZONE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendedores_updated_at
    BEFORE UPDATE ON vendedores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendas_updated_at
    BEFORE UPDATE ON vendas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar políticas de segurança (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

-- Criar políticas para usuários autenticados
CREATE POLICY "Usuários autenticados podem ver todos os clientes"
    ON clientes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir clientes"
    ON clientes FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar clientes"
    ON clientes FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem ver todos os vendedores"
    ON vendedores FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir vendedores"
    ON vendedores FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar vendedores"
    ON vendedores FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem ver todas as vendas"
    ON vendas FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir vendas"
    ON vendas FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar vendas"
    ON vendas FOR UPDATE
    TO authenticated
    USING (true); 