-- Criar tabela de produtos
CREATE TABLE produtos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    descricao TEXT,
    estoque INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de serviços
CREATE TABLE servicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de itens da venda
CREATE TABLE itens_venda (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venda_id UUID NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id),
    servico_id UUID REFERENCES servicos(id),
    quantidade INTEGER NOT NULL DEFAULT 1,
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT item_tipo_check CHECK (
        (produto_id IS NOT NULL AND servico_id IS NULL) OR
        (produto_id IS NULL AND servico_id IS NOT NULL)
    )
);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_produtos_updated_at
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at
    BEFORE UPDATE ON servicos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itens_venda_updated_at
    BEFORE UPDATE ON itens_venda
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar políticas de segurança (RLS)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_venda ENABLE ROW LEVEL SECURITY;

-- Criar políticas para produtos
CREATE POLICY "Usuários autenticados podem ver todos os produtos"
    ON produtos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir produtos"
    ON produtos FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar produtos"
    ON produtos FOR UPDATE
    TO authenticated
    USING (true);

-- Criar políticas para serviços
CREATE POLICY "Usuários autenticados podem ver todos os serviços"
    ON servicos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir serviços"
    ON servicos FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar serviços"
    ON servicos FOR UPDATE
    TO authenticated
    USING (true);

-- Criar políticas para itens da venda
CREATE POLICY "Usuários autenticados podem ver todos os itens"
    ON itens_venda FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir itens"
    ON itens_venda FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar itens"
    ON itens_venda FOR UPDATE
    TO authenticated
    USING (true); 