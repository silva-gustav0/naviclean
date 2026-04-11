-- ===========================================
-- FIX: trigger handle_new_user falha porque auth.uid() e NULL
-- durante a criacao do usuario, bloqueando a policy de INSERT
-- ===========================================

-- 1. Remover a policy de INSERT em profiles (so e criado via trigger, nunca diretamente)
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;

-- 2. Recriar a funcao do trigger com search_path explícito e mais robusta
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.email, ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Garantir que o trigger existe corretamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Garantir permissao de execucao
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
