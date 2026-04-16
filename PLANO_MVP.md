# NaviClin — Plano de Implementacao do MVP

**Audiencia:** Sonnet (executor). Este documento e o plano mestre. Cada fase e uma sessao de trabalho.

**Estado atual:**
- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind + shadcn/ui + Supabase (SSR).
- Feito: auth (login, cadastro, recuperar senha), onboarding de clinica, layout dashboard, landing page.
- Esqueletos vazios: agenda, pacientes, financeiro, equipe, tratamentos, marketing, configuracoes.
- Schema atual (ver `src/types/database.ts`): profiles, clinics, clinic_members, services, patients, appointments, dental_chart, treatment_records, transactions, treatment_plans, blog_posts, leads, notifications, files, audit_log, working_hours.

**Gaps principais vs RTF (`Site gerenciador de clínicas odontológicas_médicas (1).rtf`):**
1. Roles precisam diferenciar profissional filiado x independente; schema atual so tem `dentist`.
2. Anamnese estruturada — nao existe tabela.
3. Prescricoes digitais — nao existe tabela dedicada.
4. Odontograma por face (5 faces por dente) e marcacoes livres — schema atual guarda so 1 condicao por dente.
5. Evolucao clinica com assinatura digital bloqueante — nao existe.
6. Fila de espera com status ao vivo — appointment_status nao cobre os cores do RTF.
7. Precificacao multipla (particular + convenios) — `services.price` e unico.
8. Split de pagamento / comissionamento — inexistente.
9. Estoque (lote, validade, NF-e, baixa, alertas) — inexistente.
10. Portal publico com busca geolocalizada — inexistente.
11. Convenios — inexistentes.

---

## Convencoes Gerais (LER ANTES DE CADA FASE)

1. **Server Components por padrao.** Client Components so com `"use client"` quando precisa interatividade.
2. **Server Actions** para mutacoes (em `src/app/actions/`). Nunca mutar via client direto, exceto storage upload.
3. **Validacao:** sempre zod + react-hook-form em formularios nao-triviais. Validar tambem no server action.
4. **UI:** shadcn/ui exclusivamente. Nao criar componentes de UI primitivos do zero.
5. **Autorizacao:** toda query deve ser filtrada por `clinic_id` do usuario logado via RLS. NUNCA confiar em client-side checks.
6. **Tipos:** apos cada migracao SQL, regenerar `src/types/database.ts` com `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.
7. **Supabase migrations:** criar em `supabase/migrations/NNN_nome.sql` com numeracao incremental. Executar em ordem.
8. **Realtime:** usar Supabase Realtime para fila de espera e mudancas de status de consulta.
9. **Storage buckets:** `avatars`, `clinic-logos`, `clinic-covers` (public); `patient-files`, `treatment-images`, `prescriptions` (privados com RLS).
10. **Commitar ao final de cada fase** com mensagem descritiva. Nao commitar migracoes parciais.
11. **Testar:** antes de considerar fase concluida, subir dev server e clicar em cada tela nova.

---

## FASE 0 — Schema Cleanup e Extensoes (1 sessao)

**Objetivo:** Preparar a base de dados com todas as tabelas e enums que o MVP inteiro vai precisar. Fazer tudo de uma vez evita multiplas migracoes subsequentes.

### 0.1 — Novos ENUMs
Criar migracao `002_mvp_schema.sql`:

```sql
-- Expande user_role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'doctor';                 -- medico (generico)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'independent_professional'; -- profissional solo
-- 'dentist' ja existe; 'receptionist' ja existe; 'clinic_owner' ja existe; 'patient' ja existe.

-- Status de consulta alinhado ao RTF (cores)
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'waiting_room';      -- aguardando na recepcao
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'awaiting_payment';  -- aguardando pagamento
-- 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show' ja existem

-- Tipos novos
CREATE TYPE professional_affiliation AS ENUM ('independent', 'affiliated');
CREATE TYPE price_table_type AS ENUM ('private', 'insurance');
CREATE TYPE stock_movement_type AS ENUM ('entry', 'exit', 'adjustment', 'expired');
CREATE TYPE prescription_type AS ENUM ('recipe', 'certificate', 'referral');
CREATE TYPE evolution_status AS ENUM ('draft', 'signed');
```

### 0.2 — Novas tabelas

```sql
-- =========================
-- Convenios (Insurance plans)
-- =========================
CREATE TABLE insurance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                 -- "Amil", "Unimed", "Bradesco Saude"
  ans_code TEXT,                      -- codigo ANS opcional
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Tabelas de preco
-- =========================
CREATE TABLE price_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                 -- "Particular", "Amil Dental", etc
  type price_table_type NOT NULL,
  insurance_plan_id UUID REFERENCES insurance_plans(id) ON DELETE SET NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preco do servico por tabela
CREATE TABLE service_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  price_table_id UUID NOT NULL REFERENCES price_tables(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE(service_id, price_table_id)
);

-- Paciente pode ter vinculos com convenios
ALTER TABLE patients ADD COLUMN IF NOT EXISTS default_price_table_id UUID REFERENCES price_tables(id) ON DELETE SET NULL;

CREATE TABLE patient_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  insurance_plan_id UUID NOT NULL REFERENCES insurance_plans(id) ON DELETE CASCADE,
  policy_number TEXT,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(patient_id, insurance_plan_id)
);

-- =========================
-- Comissionamento / Split
-- =========================
-- Regra de comissao por profissional. Pode ser por servico especifico ou por categoria.
CREATE TABLE commission_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES clinic_members(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,      -- NULL = aplica por categoria
  service_category TEXT,                                            -- usado se service_id NULL
  price_table_id UUID REFERENCES price_tables(id) ON DELETE CASCADE,-- NULL = todas as tabelas
  percentage DECIMAL(5,2) NOT NULL,                                 -- 0.00 a 100.00
  priority INT DEFAULT 0,                                           -- maior vence em empate
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custo direto a abater antes do split (maquininha, laboratorio de protese)
CREATE TABLE direct_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                 -- "Taxa maquininha credito", "Laboratorio Dental Lab"
  kind TEXT NOT NULL,                 -- "payment_fee" | "external_service"
  percentage DECIMAL(5,2),            -- ex 3.49% de taxa de cartao
  fixed_amount DECIMAL(10,2),         -- ex R$ 120 custo fixo da protese
  applies_to_service_id UUID REFERENCES services(id) ON DELETE CASCADE,  -- NULL = qualquer
  applies_to_payment_method payment_method,                              -- NULL = qualquer
  is_active BOOLEAN DEFAULT true
);

-- Comissao calculada por transacao
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES clinic_members(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  gross_amount DECIMAL(10,2) NOT NULL,
  direct_costs_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,           -- gross - direct_costs
  percentage DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',      -- 'pending' ate transaction paid_at; 'released' apos pagamento; 'paid' apos repasse feito
  released_at TIMESTAMPTZ,
  paid_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Anamnese
-- =========================
CREATE TABLE anamnesis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,

  -- Texto livre
  history_of_present_illness TEXT,
  chief_complaint TEXT,
  pain_currently BOOLEAN,
  pain_level INT CHECK (pain_level BETWEEN 0 AND 10),

  -- Booleanos de saude
  has_cardiovascular BOOLEAN,
  cardiovascular_notes TEXT,
  has_diabetes BOOLEAN,
  diabetes_type TEXT,                              -- 'type_1' | 'type_2'
  has_coagulation_issues BOOLEAN,
  has_allergies BOOLEAN,
  allergies_list TEXT,                             -- penicilina, iodo, etc
  uses_continuous_medication BOOLEAN,
  medication_list TEXT,
  has_cancer_history BOOLEAN,
  has_infectious_disease BOOLEAN,
  infectious_disease_notes TEXT,
  smokes BOOLEAN,
  smoking_status TEXT,                             -- 'current' | 'former' | 'never'
  smoking_stopped_years INT,
  consumes_alcohol BOOLEAN,
  is_pregnant BOOLEAN,
  is_breastfeeding BOOLEAN,

  -- Meta
  filled_by TEXT NOT NULL DEFAULT 'staff',         -- 'staff' | 'patient'
  filled_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link temporario para paciente preencher anamnese via celular
CREATE TABLE anamnesis_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Odontograma por face
-- =========================
-- Substitui dental_chart existente (vamos repensar: manter, mas adicionar tabela de marcacoes por face)
CREATE TABLE tooth_face_marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number INT NOT NULL,                       -- FDI: 11-18, 21-28, 31-38, 41-48 (permanentes), 51-55... (deciduos)
  face TEXT NOT NULL,                              -- 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'occlusal' | 'whole'
  condition tooth_condition NOT NULL,
  mark_status TEXT NOT NULL DEFAULT 'planned',     -- 'planned' (vermelho) | 'done' (azul/verde) | 'existing'
  color_hex TEXT,                                  -- opcional para override visual
  notes TEXT,
  created_by UUID REFERENCES clinic_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simbolos sobre o dente inteiro (X extração, canal, ausente)
CREATE TABLE tooth_symbols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number INT NOT NULL,
  symbol TEXT NOT NULL,                            -- 'extraction' | 'root_canal' | 'missing' | 'implant'
  status TEXT NOT NULL DEFAULT 'planned',          -- 'planned' | 'done'
  created_by UUID REFERENCES clinic_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(patient_id, tooth_number, symbol)
);

-- =========================
-- Evolucao clinica com assinatura
-- =========================
-- Substitui conceitualmente treatment_records. Manter treatment_records para compatibilidade mas migrar para clinical_evolutions para novos registros.
CREATE TABLE clinical_evolutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  author_member_id UUID NOT NULL REFERENCES clinic_members(id),

  procedures_performed TEXT NOT NULL,              -- o que foi realizado
  materials_used TEXT,                             -- materiais usados
  tooth_numbers INT[],                             -- dentes envolvidos
  observations TEXT,

  status evolution_status NOT NULL DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  signed_by_name TEXT,                             -- snapshot do nome no momento da assinatura
  signed_by_cro TEXT,                              -- snapshot do CRO/CRM
  signed_hash TEXT,                                -- hash SHA-256 do conteudo no momento da assinatura

  created_at TIMESTAMPTZ DEFAULT NOW()
  -- Sem updated_at. Apos assinatura, proibir UPDATE (enforcado via trigger + RLS).
);

-- Anexos da evolucao (radiografias, fotos) — referencia files
CREATE TABLE evolution_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evolution_id UUID NOT NULL REFERENCES clinical_evolutions(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  attachment_type TEXT NOT NULL,                   -- 'xray_panoramic' | 'xray_periapical' | 'tomography' | 'photo' | 'document'
  UNIQUE(evolution_id, file_id)
);

-- =========================
-- Prescricoes digitais
-- =========================
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  evolution_id UUID REFERENCES clinical_evolutions(id) ON DELETE SET NULL,
  author_member_id UUID NOT NULL REFERENCES clinic_members(id),

  type prescription_type NOT NULL,                 -- 'recipe' | 'certificate' | 'referral'
  title TEXT NOT NULL,
  content TEXT NOT NULL,                           -- texto livre
  days_off INT,                                    -- so para atestado
  pdf_url TEXT,                                    -- storage privado
  signed_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Fila de espera / check-in
-- =========================
CREATE TABLE appointment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  from_status appointment_status,
  to_status appointment_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Estoque
-- =========================
CREATE TABLE stock_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,                                   -- 'consumable' | 'medication' | 'instrument' | 'prosthetic_material'
  unit TEXT NOT NULL,                              -- 'box' | 'unit' | 'ml' | 'l' | 'kg'
  minimum_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stock_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  stock_item_id UUID NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  batch_number TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  expiry_date DATE,
  nfe_key TEXT,                                    -- chave da NF-e de origem
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  stock_item_id UUID NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES stock_batches(id) ON DELETE SET NULL,
  type stock_movement_type NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,                 -- positivo sempre; type indica direcao
  reason TEXT,                                     -- 'nfe_import', 'manual_entry', 'appointment_use', 'expired_discard', 'adjustment'
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nfe_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  nfe_key TEXT UNIQUE NOT NULL,                    -- chave de 44 digitos
  supplier_name TEXT,
  issue_date DATE,
  total_amount DECIMAL(10,2),
  xml_url TEXT,                                    -- storage privado
  status TEXT DEFAULT 'imported',                  -- 'imported' | 'processed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Avaliacoes (reviews) do portal publico
-- =========================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  member_id UUID REFERENCES clinic_members(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Extensoes em tabelas existentes
-- =========================
ALTER TABLE clinic_members
  ADD COLUMN IF NOT EXISTS affiliation professional_affiliation DEFAULT 'affiliated',
  ADD COLUMN IF NOT EXISTS rqe TEXT,                             -- Registro de Qualificacao de Especialista (medicos)
  ADD COLUMN IF NOT EXISTS full_name TEXT,                       -- redundante com profiles mas util para display
  ADD COLUMN IF NOT EXISTS bio_long TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS procedures_performed TEXT[];          -- lista publica

ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS cnpj TEXT,
  ADD COLUMN IF NOT EXISTS legal_name TEXT,                      -- razao social
  ADD COLUMN IF NOT EXISTS technical_responsible_name TEXT,
  ADD COLUMN IF NOT EXISTS technical_responsible_cro TEXT,
  ADD COLUMN IF NOT EXISTS bank_info JSONB;                      -- { bank, agency, account, pix_key }

ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS anamnesis_completed_at TIMESTAMPTZ;

-- Bloqueia edicao de evolucao apos assinatura
CREATE OR REPLACE FUNCTION prevent_signed_evolution_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'signed' THEN
    RAISE EXCEPTION 'Evolucao ja assinada nao pode ser alterada';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lock_signed_evolutions
BEFORE UPDATE OR DELETE ON clinical_evolutions
FOR EACH ROW EXECUTE FUNCTION prevent_signed_evolution_update();

-- Registro automatico de evento ao mudar status da consulta
CREATE OR REPLACE FUNCTION log_appointment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO appointment_events (clinic_id, appointment_id, from_status, to_status, changed_by)
    VALUES (NEW.clinic_id, NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER track_appointment_status
AFTER UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION log_appointment_status_change();
```

### 0.3 — RLS das novas tabelas
Criar migracao `003_mvp_rls.sql`. Regra geral: `clinic_id` deve bater com uma clinica onde `auth.uid()` e membro ativo. Usar as funcoes `is_clinic_member(clinic_id)` e `is_clinic_owner(clinic_id)` que ja existem.

- **Leitura**: `is_clinic_member(clinic_id)` para todas as tabelas acima.
- **Escrita em clinical_evolutions**: autor deve ser membro; INSERT liberado, UPDATE bloqueado se status='signed' (trigger ja cuida).
- **tooth_face_marks / tooth_symbols**: dentist/independent_professional podem criar; receptionist so le.
- **stock_***: clinic_owner + receptionist podem baixar; clinic_owner pode cadastrar e importar NFe.
- **commissions**: clinic_owner + o proprio membro podem ler sua comissao; so clinic_owner altera.
- **reviews**: insert publico se paciente autenticado; select publico.
- **anamnesis_tokens**: select publico via token exato (endpoint publico valida).
- **Portal publico (clinics, clinic_members, services, reviews)**: policy adicional que permite SELECT para rows publicas anonimas — ex: `clinics.is_active = true AND allow_online_booking = true`.

### 0.4 — Storage buckets

```sql
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('clinic-logos', 'clinic-logos', true),
  ('clinic-covers', 'clinic-covers', true),
  ('patient-files', 'patient-files', false),
  ('treatment-images', 'treatment-images', false),
  ('prescriptions', 'prescriptions', false),
  ('nfe-xml', 'nfe-xml', false)
ON CONFLICT DO NOTHING;
```
Configurar policies de storage para buckets privados: so membro da clinica le, so membro insere.

### 0.5 — Regenerar tipos
```bash
npx supabase gen types typescript --local > src/types/database.ts
# ou se estiver em remoto:
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```

### Checklist FASE 0
- [ ] Migracao `002_mvp_schema.sql` criada e aplicada
- [ ] Migracao `003_mvp_rls.sql` criada e aplicada
- [ ] Buckets de storage criados
- [ ] `src/types/database.ts` regenerado
- [ ] `npm run build` passa sem erros de tipo
- [ ] Commit: "feat: schema completo do MVP (anamnese, odontograma, estoque, split, prescricoes)"

---

## FASE 1 — Modulo Clinico (2 sessoes)

**Objetivo:** Dentista consegue atender: ver paciente, preencher anamnese, marcar odontograma, registrar evolucao assinada, emitir prescricao.

### 1.1 — Ficha do Paciente com Tabs
Arquivo: `src/app/(dashboard)/pacientes/[id]/page.tsx`

Layout: header com foto/nome/idade/convenio + 6 tabs (shadcn `Tabs`):
1. **Dados pessoais** — form editavel (ja ha action `patients.ts`, precisa estender)
2. **Anamnese** — formulario estruturado (ver 1.2)
3. **Odontograma** — componente visual (ver 1.3)
4. **Evolucao clinica** — timeline + novo registro (ver 1.4)
5. **Agendamentos** — historico + proximos (basico, ja existe dado)
6. **Documentos** — upload/lista de arquivos (Supabase Storage)

Cada tab e um componente server (onde possivel) em `src/components/dashboard/patient/`:
- `PatientHeader.tsx`
- `PersonalDataTab.tsx`
- `AnamnesisTab.tsx`
- `OdontogramTab.tsx`
- `EvolutionsTab.tsx`
- `AppointmentsTab.tsx`
- `DocumentsTab.tsx`

Lista de pacientes em `src/app/(dashboard)/pacientes/page.tsx`:
- DataTable com busca (pg_trgm ja ativo), filtros por status, paginacao.
- Colunas: foto, nome, telefone, convenio, proximo agendamento, ultimo atendimento.
- Botao "Novo paciente" abre dialog com form de cadastro expresso (nome + CPF + telefone) + opcao "Enviar link de anamnese".

### 1.2 — Formulario de Anamnese

Componente `AnamnesisForm.tsx` (client component, `"use client"`).
- Zod schema cobrindo todos os campos em `anamnesis` table.
- Layout em secoes: "Queixa principal" | "Historico medico" | "Medicamentos" | "Habitos" | "Especifico feminino".
- Campos booleanos como `Switch`; "se sim" expande `Textarea` condicional.
- Botao "Salvar anamnese" → server action `src/app/actions/anamnesis.ts` → upsert em `anamnesis` por `patient_id` (so 1 por paciente; atualiza `updated_at`).

Link publico para paciente preencher:
- Rota `src/app/anamnese/[token]/page.tsx` (fora do grupo auth).
- Valida token em `anamnesis_tokens`, checa `expires_at`.
- Mesmo form, marca `filled_by='patient'` ao submit.
- Acao `generateAnamnesisToken(patientId)` cria token com 72h validade, retorna URL para copiar.

### 1.3 — Odontograma Interativo

Componente `Odontogram.tsx` (client).
- SVG com 32 dentes permanentes (adulto) + toggle para deciduos (20 dentes numerados 51-55, 61-65, 71-75, 81-85).
- Cada dente: 5 retangulos clicaveis (vestibular, lingual, mesial, distal, oclusal) + area "fora" do dente para simbolos (X, risco, circulo).
- Layout: arcada superior (esquerda-direita: 18→11 / 21→28) e inferior (48→41 / 31→38). Ou seja, lingual do superior vira pra baixo.
- Ao clicar em uma face, abre `Popover` com:
  - Radio: "A fazer (vermelho)" | "Feito (azul)" | "Ja existia (verde)" | "Limpar"
  - Select: condicao (`tooth_condition` enum)
  - Textarea: notes
- Ao clicar fora do dente (area do simbolo), abre popover para adicionar simbolo.
- Persistencia: server action `src/app/actions/odontogram.ts`:
  - `upsertFaceMark(patientId, toothNumber, face, payload)`
  - `removeFaceMark(id)`
  - `upsertToothSymbol(patientId, toothNumber, symbol, payload)`
- Ao carregar: buscar `tooth_face_marks` e `tooth_symbols` do paciente, renderizar.

Arquivo de referencia da numeracao FDI:
```ts
// src/lib/odontogram/teeth.ts
export const PERMANENT_TEETH = {
  upperRight: [18,17,16,15,14,13,12,11],
  upperLeft: [21,22,23,24,25,26,27,28],
  lowerLeft: [38,37,36,35,34,33,32,31],
  lowerRight: [41,42,43,44,45,46,47,48],
}
export const DECIDUOUS_TEETH = {
  upperRight: [55,54,53,52,51],
  upperLeft: [61,62,63,64,65],
  lowerLeft: [75,74,73,72,71],
  lowerRight: [81,82,83,84,85],
}
export const FACE_COLORS = {
  planned: '#ef4444',  // vermelho
  done: '#3b82f6',     // azul
  existing: '#10b981', // verde
}
```

### 1.4 — Evolucao Clinica com Assinatura

Componente `EvolutionsTab.tsx`:
- Lista de evolucoes ordenadas por data desc, cada uma mostrando data/profissional/procedimentos/status.
- Botao "Nova evolucao" abre form em dialog ou sheet:
  - Campos: procedimentos realizados, materiais usados, dentes envolvidos (multi-select com numeros FDI), observacoes.
  - Upload de anexos (integra com bucket `treatment-images` e tabela `files`/`evolution_attachments`).
  - Botao "Salvar rascunho" (status='draft') ou "Salvar e assinar" (status='signed').
- Ao assinar: server action `signEvolution(evolutionId)`:
  1. Calcula SHA-256 do conteudo concatenado.
  2. Busca nome + CRO do `clinic_members` do autor.
  3. Atualiza status='signed', signed_at=NOW(), signed_by_name, signed_by_cro, signed_hash.
  4. Apos isso, UPDATE/DELETE e bloqueado pelo trigger.
- UI mostra badge "Assinado por Dr. X em dd/mm/yy HH:mm" nas evolucoes signed; rascunhos em cinza com botao "Assinar".

### 1.5 — Prescricoes Digitais

Componente `PrescriptionDialog.tsx`:
- Trigger: dentro da evolucao, botao "+ Receita" / "+ Atestado" / "+ Encaminhamento".
- Form simples: titulo + texto + (se atestado) dias de afastamento.
- Ao salvar: gera PDF no servidor via endpoint `src/app/api/prescriptions/[id]/pdf/route.ts`:
  - Usa lib `@react-pdf/renderer` (instalar) ou template HTML + biblioteca puppeteer-free (ex: `pdf-lib` construcao manual).
  - Sugestao: `pdf-lib` (nao precisa Chromium, funciona em Fluid Compute). Template com cabecalho da clinica + paciente + conteudo + assinatura (nome, CRO, hash).
  - Upload para bucket `prescriptions` com path `{clinic_id}/{patient_id}/{prescription_id}.pdf`.
  - Salvar `pdf_url` na tabela.
- Disponivel via URL assinada (Supabase `getSignedUrl`) no portal do paciente e na ficha.

### Checklist FASE 1
- [ ] Instalar deps: `pdf-lib`
- [ ] Ficha do paciente com 6 tabs funcionais
- [ ] Anamnese preenchivel interna + link publico
- [ ] Odontograma salva e carrega marcacoes
- [ ] Evolucao com assinatura bloqueia edicao
- [ ] Prescricao gera PDF e aparece na ficha
- [ ] Commit: "feat: modulo clinico (anamnese, odontograma, evolucao, prescricoes)"

---

## FASE 2 — Agenda e Fluxo de Recepcao (1.5 sessoes)

**Objetivo:** Visualizar, criar, mudar status de consulta; fila de espera em tempo real.

### 2.1 — Calendario de Agenda
Arquivo: `src/app/(dashboard)/agenda/page.tsx`

- Biblioteca: `react-day-picker` ja instalado; usar para month view. Para day/week view, construir grid proprio com Tailwind (colunas = membros ativos, linhas = slots de 15min do start_time ao end_time do `working_hours`).
- Toggle de view: Dia | Semana | Mes.
- Dia (multi-profissional): colunas lado a lado de cada membro ativo no dia. Cada card de consulta exibe nome do paciente + procedimento + cor do status.
- Cores dos status (usar em todas as views):
  - `scheduled`: slate-400
  - `confirmed`: blue-500
  - `waiting_room`: amber-500 (🟠 aguardando)
  - `in_progress`: green-500 (🟢 em atendimento)
  - `awaiting_payment`: orange-600 (🟣 aguardando pagamento — usar violeta seria mais fiel ao RTF, vamos de violet-500)
  - `completed`: indigo-500 (🔵 finalizado)
  - `no_show`: red-500 (🔴 faltou)
  - `cancelled`: neutral-300
- Clique em um card abre `AppointmentDetailSheet` (shadcn Sheet) com dados e botoes de mudanca de status.
- Botao "+ Novo agendamento" abre `AppointmentFormDialog`:
  - Select paciente (combobox com busca) | Select profissional | Select servico | Date picker | Time select.
  - Valida conflito de horario (query: consulta existente no mesmo dentista+data com horario sobreposto).

### 2.2 — Mudanca de Status
Server action `src/app/actions/appointments.ts`:
- `changeAppointmentStatus(appointmentId, newStatus)`
- Valida transicoes permitidas (ex: nao pode pular de `scheduled` direto para `completed`; deve passar por `in_progress`).
- Registro em `appointment_events` e disparado pelo trigger do banco, nao precisa logica no app.

### 2.3 — Fila de Espera em Tempo Real
Componente `WaitingRoomPanel.tsx` na agenda:
- Lista consultas do dia com status `waiting_room` e `in_progress`, ordenadas por horario.
- Subscribe em `appointments` via Supabase Realtime filtrando `clinic_id` e `date=today`.
- Atualiza estado local sem recarregar pagina.

Alerta no consultorio:
- No dashboard do dentista (`/dashboard`), widget "Pacientes aguardando" mostra count + nome do proximo.
- Ao `waiting_room` mudar, widget pisca com `animate-pulse` por 10s.
- Som opcional (tocar audio discreto ao chegar novo paciente).

### 2.4 — Interface de Recepcao
- Receptionist ve a mesma tela de agenda, mas com acoes simplificadas:
  - Card de consulta tem botoes rapidos: "Confirmou chegada" (→ waiting_room), "Chamou" (→ in_progress), "Liberar para pagamento" (→ awaiting_payment), "Finalizar" (→ completed), "Faltou" (→ no_show).
- Formulario "Cadastro Expresso" em `src/components/dashboard/quick-patient-form.tsx`:
  - Apenas Nome + CPF + Telefone.
  - Opcao: "Enviar link de anamnese" (gera token, retorna URL para copiar ou botao `share` via WhatsApp Web).

### 2.5 — Working hours
Configuracao em `/configuracoes/horarios` (ja existe esqueleto):
- Tabela por dia da semana com start/end editavel.
- Opcao de horarios individuais por membro (se nao setado, herda da clinica).
- Server action `upsertWorkingHours`.

### Checklist FASE 2
- [ ] Calendario dia/semana/mes funcional
- [ ] Criacao de consulta com validacao de conflito
- [ ] Mudanca de status com botoes rapidos
- [ ] Fila de espera ao vivo via Realtime
- [ ] Alerta piscando no dashboard do dentista
- [ ] Cadastro expresso + link de anamnese funcional
- [ ] Horarios de atendimento configuraveis
- [ ] Commit: "feat: agenda com fila de espera em tempo real"

---

## FASE 3 — Financeiro, Precificacao e Split (1.5 sessoes)

**Objetivo:** Clinica cobra, clinica paga, sistema calcula comissao automaticamente.

### 3.1 — Convenios e Tabelas de Preco
Pagina `src/app/(dashboard)/configuracoes/convenios/page.tsx`:
- Lista de `insurance_plans` com CRUD.
- Ao criar convenio, opcionalmente criar tabela de preco associada.

Pagina `src/app/(dashboard)/configuracoes/tabelas-preco/page.tsx`:
- Lista de `price_tables` (particular + convenios).
- Editar tabela abre tela com lista de servicos e input de preco para aquela tabela.
- Botao "Copiar precos de outra tabela" para rapido setup.

Refatorar catalogo de tratamentos (`/tratamentos`):
- Listar servicos.
- Ao abrir um servico, mostrar tabela com preco em cada `price_table`.
- `services.price` continua existindo como fallback (preco base).

### 3.2 — Fluxo de Caixa
`src/app/(dashboard)/financeiro/page.tsx` (overhaul do existente):
- Cards: receita do mes, despesa do mes, saldo, contas a receber, inadimplencia.
- Grafico receita vs despesa (ultimos 6 meses) — recharts.
- Grafico pizza por categoria.
- Tabela de transacoes recentes.

Sub-paginas:
- `/financeiro/receitas/page.tsx` — tabela com filtros (periodo, categoria, status, metodo). Modal para nova receita.
- `/financeiro/despesas/page.tsx` — idem para despesa.
- `/financeiro/comissoes/page.tsx` — ver 3.4.

Modal de transacao:
- Campos: tipo, categoria, descricao, valor, paciente (se receita clinica), appointment (opcional, autopopula paciente/valor), metodo de pagamento, parcelamento, data vencimento.
- Ao salvar receita vinculada a appointment: disparar calculo de comissao (ver 3.4).

### 3.3 — Orcamentos / Planos de Tratamento
Ja existe `treatment_plans`. Pagina `src/app/(dashboard)/pacientes/[id]/orcamentos/new/page.tsx`:
- Form: selecionar profissional, servicos (pode selecionar dente especifico), desconto, validade.
- Calcula total automaticamente com base na `price_table` do paciente.
- Botao "Enviar por WhatsApp" gera texto + link wa.me.
- Status flow: pending → approved → in_progress → completed.
- Ao aprovar orcamento, opcao de gerar transacoes de receita (parcelamento).

### 3.4 — Split de Pagamento / Comissao
Logica em `src/lib/commission/calculate.ts`:

```ts
// Pseudocode
export async function calculateCommissions(transactionId: string) {
  // 1. Buscar transaction + appointment + service + patient_price_table
  // 2. Identificar member responsavel (dentist_id da appointment)
  // 3. Buscar custo direto aplicavel:
  //    - Se payment_method tem direct_cost (ex taxa cartao)
  //    - Se service_id tem direct_cost (ex laboratorio protese)
  //    - Somar todos (percentage ou fixed) → direct_costs_amount
  // 4. net = gross - direct_costs
  // 5. Buscar commission_rule aplicavel:
  //    - Match exato (service_id + price_table_id) > match por categoria > fallback
  //    - priority mais alta vence
  // 6. commission_amount = net * percentage / 100
  // 7. INSERT em commissions com status='pending'
  // 8. Se transaction.paid_at IS NOT NULL, setar status='released', released_at=paid_at
}
```

Trigger: chamar `calculateCommissions` na server action que cria transacao E na que marca como paga.

Pagina `/financeiro/comissoes`:
- Tabela por profissional: comissoes pending (a pagar quando paciente pagar) | released (ja liberadas, aguardando repasse) | paid (ja repassadas).
- Filtro por periodo.
- Botao "Marcar como repassado" (batch) → status='paid', paid_out_at=NOW().
- Relatorio de repasse por profissional em PDF.

Pagina `/equipe/[memberId]/comissoes`:
- Visao do proprio profissional (ou do dono).
- Mesma logica, scoped ao membro.

Pagina de configuracao de regras: `/configuracoes/comissoes/page.tsx`:
- Lista de `commission_rules` por membro.
- Form: membro + servico/categoria + tabela + percentage + priority.
- Lista de `direct_costs`: taxa de maquininha por metodo, custos por servico.

### 3.5 — Relatorios
`/financeiro/relatorios/page.tsx`:
- Fluxo de caixa mensal/anual.
- Receita por dentista.
- Receita por servico.
- Inadimplencia.
- Ticket medio.
- Exportar PDF (pdf-lib) / CSV.

### Checklist FASE 3
- [ ] Convenios CRUD
- [ ] Price tables CRUD com editor de precos
- [ ] Financeiro overhaul com graficos
- [ ] Transacoes com autopopular appointment
- [ ] Orcamentos funcionais com price table correta
- [ ] Calculo de comissao automatico e correto (testar com numeros)
- [ ] Tela de gestao de comissoes por profissional
- [ ] Relatorios PDF
- [ ] Commit: "feat: financeiro com split e convenios"

---

## FASE 4 — Estoque (1 sessao)

**Objetivo:** Gerenciar itens, lotes, validade; importar NF-e; alertas de minimo e vencimento.

### 4.1 — Cadastro de Itens
`src/app/(dashboard)/estoque/page.tsx` (novo):
- Tabela de `stock_items` com saldo total (sum de `stock_batches.quantity`).
- Colunas: nome, marca, categoria, saldo, minimo, alerta (badge vermelho se saldo < minimo), proximo vencimento.
- CRUD via dialog.

### 4.2 — Entrada de Estoque

**Entrada manual:**
- Botao "+ Entrada manual" abre dialog.
- Selecionar item, quantidade, lote (opcional), validade (opcional).
- Server action `stockEntry` cria `stock_batches` + `stock_movements` type='entry'.

**Importar NF-e XML:**
- Pagina `/estoque/importar-nfe`:
  - Upload de arquivo `.xml` (storage bucket `nfe-xml`).
  - Parser server-side em `src/lib/nfe/parse.ts`: extrai `infNFe.det[]` (itens), `emit.xNome` (fornecedor), `chNFe` (chave).
  - Biblioteca: `fast-xml-parser` (leve, sem deps nativas).
  - Apos parse, tela de mapeamento: cada item da NFe → item do estoque existente (ou "Criar novo item").
  - Ao confirmar, cria `nfe_imports`, `stock_batches` e `stock_movements`.

### 4.3 — Saida (Baixa)
Widget compacto na agenda/recepcao:
- Botao "Baixa rapida" abre dialog: selecionar item + quantidade + (opcional) appointment atual.
- Server action: `stockExit` cria `stock_movements` type='exit', debitando do batch mais antigo (FEFO — first expired, first out).
- Se um batch atingir 0, marcar como consumido.

### 4.4 — Alertas Dashboard
No dashboard principal (`/dashboard`), widget "Alertas de estoque":
- Itens abaixo do minimo (query: stock_items com SUM(batches.quantity) < minimum_stock).
- Itens com validade proxima (30/60 dias).
- Botao "Gerar sugestao de compras" → PDF com lista de itens a comprar (pdf-lib).

### 4.5 — Descarte de Vencidos
Job mensal (Cron via Vercel ou botao manual inicialmente):
- Para cada batch com `expiry_date < CURRENT_DATE`, criar movement type='expired' debitando quantidade restante.
- Notificar owner.

### Checklist FASE 4
- [ ] Instalar `fast-xml-parser`
- [ ] CRUD de stock_items
- [ ] Entrada manual + importacao NFe
- [ ] Baixa rapida integrada a agenda
- [ ] Alertas no dashboard
- [ ] Sugestao de compras PDF
- [ ] Commit: "feat: modulo de estoque com NFe e alertas"

---

## FASE 5 — Equipe, Permissoes e Auditoria (0.5 sessao)

**Objetivo:** Gestao de profissionais e seguranca LGPD.

### 5.1 — Gestao de Equipe
`src/app/(dashboard)/equipe/page.tsx`:
- Lista de `clinic_members` com foto, nome, especialidade, CRO, status.
- Botao "Convidar membro" abre dialog:
  - Campos: email, role (dentist/doctor/receptionist), especialidade, CRO, affiliation.
  - Server action `inviteMember`: cria profile pendente + envia email via Resend com link de `/aceitar-convite/[token]`.
  - Ao aceitar, usuario cria senha e e vinculado ao `clinic_members`.
- Edicao: alterar role, affiliation, especialidade, ativar/desativar.

### 5.2 — Permissoes (Role-based)
Utilitario `src/lib/auth/permissions.ts`:

```ts
export const PERMISSIONS = {
  'finance:read_all': ['clinic_owner'],
  'finance:write': ['clinic_owner'],
  'stock:manage': ['clinic_owner'],
  'stock:exit': ['clinic_owner', 'receptionist', 'dentist', 'doctor', 'independent_professional'],
  'patient:read_sensitive': ['clinic_owner', 'dentist', 'doctor', 'independent_professional'],
  'patient:read_basic': ['clinic_owner', 'dentist', 'doctor', 'receptionist', 'independent_professional'],
  'evolution:write': ['dentist', 'doctor', 'independent_professional', 'clinic_owner'],
  'appointment:manage': ['clinic_owner', 'receptionist'],
  'settings:manage': ['clinic_owner'],
} as const

export async function requirePermission(perm: keyof typeof PERMISSIONS) {
  // verifica role do usuario no clinic_members ativo
  // redirect se nao autorizado
}
```

Sidebar dinamica: esconder itens conforme permissao.

### 5.3 — Auditoria LGPD
Ja existe `audit_log`. Criar helper `src/lib/audit/log.ts`:
```ts
export async function logAccess(action: string, entityType: string, entityId?: string, oldData?: any, newData?: any)
```
- Chamar em todo server action sensivel (ler prontuario, editar paciente, gerar prescricao).
- Tambem em middleware de login/logout.

Pagina `/configuracoes/auditoria`:
- Tabela de logs filtrada por usuario, entidade, periodo.
- Somente clinic_owner acessa.

### Checklist FASE 5
- [ ] Convite por email funcional
- [ ] Permissoes aplicadas em todas as rotas
- [ ] Sidebar oculta itens sem permissao
- [ ] Log de auditoria preenchido em acoes sensiveis
- [ ] Tela de auditoria filtravel
- [ ] Commit: "feat: equipe, permissoes e auditoria LGPD"

---

## FASE 6 — Portal Publico do Paciente (1.5 sessoes)

**Objetivo:** Paciente descobre clinicas, agenda online, ve historico.

### 6.1 — Busca Geolocalizada
Rota publica `src/app/(portal)/buscar/page.tsx`:
- Input de busca por especialidade/procedimento.
- Botao "Usar minha localizacao" → `navigator.geolocation` → salva em URL state.
- Cards de clinicas/profissionais com distancia calculada (Haversine no server).
- Mapa com Google Maps Embed API (ou `@googlemaps/react-wrapper`) mostrando pins.
- Filtros: especialidade, aceita convenio X, atende hoje, avaliacao minima.
- Query SQL usa `latitude/longitude` das clinicas. Ordem: distancia asc, depois review_avg desc.

### 6.2 — Perfil Publico da Clinica/Profissional
`src/app/(portal)/c/[slug]/page.tsx` (clinica) e `src/app/(portal)/p/[slug]/page.tsx` (profissional independente).
- Hero com nome, foto, especialidade, CRO/CRM, RQE.
- Secoes: sobre, equipe, procedimentos realizados, fotos do local, avaliacoes, endereco com mapa, horarios.
- CTA: "Agendar consulta".

### 6.3 — Agendamento Self-Service
Rota `src/app/(portal)/c/[slug]/agendar/page.tsx`:
- Step 1: escolher profissional + servico.
- Step 2: escolher dia → renderizar horarios livres (calcular slots disponiveis a partir de `working_hours` menos `appointments` existentes menos `appointment_duration + buffer`).
- Step 3: dados do paciente — se logado, auto-fill; senao, formulario.
- Ao confirmar, criar `appointment` com status='scheduled' e reservar slot por 10min (tabela `booking_holds` simples ou flag no appointment).
- Enviar confirmacao por email (Resend) e WhatsApp (stub por enquanto, usar link wa.me).
- Link de anamnese incluido no email de confirmacao.

### 6.4 — Area Logada do Paciente
Rotas `src/app/(portal)/meu-*`:
- `/meus-agendamentos` — lista proximos + passados, opcao cancelar (ate 24h antes).
- `/meu-prontuario` — historico de atendimentos e receituarios em PDF (via signed URL).
- `/meu-perfil` — editar dados, adicionar convenio.

### 6.5 — Avaliacoes
Apos appointment com status='completed', enviar email 24h depois com link para avaliar.
- Rota `src/app/(portal)/avaliar/[appointmentId]/page.tsx`.
- Form simples: rating 1-5 + comentario opcional.
- Insere em `reviews`.

### Checklist FASE 6
- [ ] Busca com geolocalizacao + distancia real
- [ ] Perfis publicos de clinica/profissional
- [ ] Agendamento self-service com reserva temporaria
- [ ] Email de confirmacao com link de anamnese
- [ ] Area logada do paciente
- [ ] Sistema de reviews
- [ ] Commit: "feat: portal publico do paciente"

---

## FASE 7 — Assinaturas e Billing (1 sessao)

**Objetivo:** Cobrar mensalidade das clinicas via Stripe.

### 7.1 — Planos
Criar produtos e precos no Stripe Dashboard:
- **Plano Solo** — R$ 97/mes (1 profissional independente, max 150 pacientes ativos)
- **Plano Clinica Starter** — R$ 297/mes (ate 5 profissionais, pacientes ilimitados, estoque basico)
- **Plano Clinica Pro** — R$ 597/mes (ate 15 profissionais, estoque avancado, relatorios, prioritario)
- **Trial** — 14 dias gratis, bloqueio apos expiracao se nao assinar.

Salvar price IDs em variaveis de ambiente:
```
STRIPE_PRICE_SOLO=price_xxx
STRIPE_PRICE_CLINIC_STARTER=price_xxx
STRIPE_PRICE_CLINIC_PRO=price_xxx
```

### 7.2 — Checkout
Pagina `/configuracoes/plano/page.tsx`:
- Cards dos planos com CTA "Assinar".
- Server action `createCheckoutSession(priceId)`:
  - Cria ou recupera `stripe_customer_id` da clinica.
  - Cria Checkout Session em mode='subscription'.
  - Retorna URL, frontend redireciona.
- Webhook `src/app/api/webhooks/stripe/route.ts`:
  - Eventos: `customer.subscription.created/updated/deleted`, `invoice.paid`, `invoice.payment_failed`.
  - Atualiza `clinics.subscription_plan` e `subscription_status`.

### 7.3 — Feature Gating
Middleware `src/lib/subscription/check.ts`:
```ts
export async function requireActivePlan() {
  // verifica subscription_status; se 'trialing' e trial_ends_at < now, bloqueia.
  // se plan nao tem feature X (ex plano solo nao tem estoque), bloqueia rota.
}
```
Chamar em server actions sensiveis e em layouts de secoes premium.

Banner no dashboard quando trial acabando (< 3 dias) ou `past_due`.

### 7.4 — Gerenciamento
Portal do cliente Stripe:
- Botao "Gerenciar assinatura" cria Stripe Billing Portal session.
- Permite upgrade/downgrade/cancelamento pelo proprio cliente.

### Checklist FASE 7
- [ ] Produtos criados no Stripe
- [ ] Checkout funcional
- [ ] Webhooks processando eventos
- [ ] Feature gating ativo
- [ ] Portal de billing do cliente
- [ ] Banner de aviso de trial
- [ ] Commit: "feat: assinatura via stripe com feature gating"

---

## FASE 8 — Notificacoes e Integracoes (0.5 sessao)

**Objetivo:** Lembretes automaticos, emails transacionais, WhatsApp.

### 8.1 — Resend (Emails Transacionais)
Templates em `src/emails/` usando `@react-email/components`:
- `WelcomeEmail.tsx`
- `AppointmentConfirmationEmail.tsx`
- `AppointmentReminderEmail.tsx` (24h antes)
- `InviteTeamMemberEmail.tsx`
- `ReviewRequestEmail.tsx`
- `AnamnesisLinkEmail.tsx`

Helper `src/lib/email/send.ts` encapsula Resend client.

### 8.2 — Cron de Lembretes
Arquivo `src/app/api/cron/reminders/route.ts`:
- Autenticacao via secret em header (`CRON_SECRET`).
- Busca appointments amanha com `reminder_sent=false`.
- Envia email + tenta WhatsApp.
- Marca `reminder_sent=true`.

Configurar no `vercel.ts`:
```ts
import type { VercelConfig } from '@vercel/config/v1';
export const config: VercelConfig = {
  crons: [
    { path: '/api/cron/reminders', schedule: '0 13 * * *' }, // 10h BRT diariamente
    { path: '/api/cron/stock-alerts', schedule: '0 11 * * 1' }, // segunda 8h BRT
  ],
};
```

### 8.3 — WhatsApp (Evolution API / Z-API)
Helper `src/lib/whatsapp/send.ts`:
- POST para endpoint da API externa com numero + mensagem.
- Fallback: se falhar, gerar link `wa.me/` e usar nos CTAs.

### 8.4 — Botao WhatsApp Flutuante
No portal publico, botao flutuante no canto inferior direito (ja existe design no Footer da landing). Abre chat direto com o numero da clinica.

### Checklist FASE 8
- [ ] Instalar `@react-email/components`
- [ ] Emails templated funcionando via Resend
- [ ] Cron de lembretes configurado em vercel.ts
- [ ] WhatsApp API integrada (ou fallback wa.me)
- [ ] Commit: "feat: notificacoes automatizadas"

---

## FASE 9 — SEO, Performance e Deploy (0.5 sessao)

### 9.1 — SEO
- `generateMetadata` dinamico em todas as paginas publicas (portal e perfis).
- `sitemap.xml` em `src/app/sitemap.ts` listando todas as clinicas publicas + slugs de profissionais.
- `robots.txt` em `src/app/robots.ts`.
- Schema.org JSON-LD no perfil publico: `LocalBusiness` + `Dentist`/`MedicalBusiness`.
- Open Graph images dinamicas via `next/og`.

### 9.2 — Performance
- Todas imagens publicas via `next/image`.
- `loading.tsx` com Skeletons em todas as rotas do dashboard.
- `error.tsx` boundaries com fallback amigavel.
- Streaming com Suspense em queries caras (ex: lista longa de pacientes).
- Revisar bundle size: `@next/bundle-analyzer`.
- ISR em paginas de perfis publicos (revalidate: 3600).

### 9.3 — Deploy
- `vercel.ts` com builds/redirects/crons configurado.
- Envs em producao via `vercel env` (usar skill `vercel:env-vars` do plugin).
- Dominio customizado `naviclin.com.br` (ou equivalente).
- Supabase em producao (migrar schema).
- Monitoramento: Vercel Analytics + Sentry (opcional).

### Checklist FASE 9
- [ ] Sitemap + robots + JSON-LD
- [ ] Skeletons + error boundaries em todas as rotas
- [ ] vercel.ts finalizado
- [ ] Build passa sem warnings
- [ ] Deploy em preview + producao
- [ ] Commit: "chore: seo, performance e deploy"

---

## Ordem de Execucao Recomendada (~11 sessoes)

1. **FASE 0** — Schema + RLS + Storage (1 sessao)
2. **FASE 1** — Modulo Clinico (2 sessoes)
3. **FASE 2** — Agenda + Recepcao (1.5 sessao)
4. **FASE 3** — Financeiro + Split (1.5 sessao)
5. **FASE 4** — Estoque (1 sessao)
6. **FASE 5** — Equipe + Permissoes + Auditoria (0.5 sessao)
7. **FASE 6** — Portal Publico (1.5 sessao)
8. **FASE 7** — Assinaturas (1 sessao)
9. **FASE 8** — Notificacoes (0.5 sessao)
10. **FASE 9** — SEO + Deploy (0.5 sessao)

**Pontos de verificacao para o dono do produto (Gustavo):**
- Apos FASE 2 — testar fluxo clinico real com um paciente ficticio
- Apos FASE 3 — conferir numeros de comissao com um caso real
- Apos FASE 6 — agendar pelo portal publico como se fosse paciente
- Apos FASE 7 — fazer uma assinatura de teste
- Apos FASE 9 — convidar 1-2 clinicas beta

---

## Licao importante para o Sonnet

- **Leia este documento inteiro antes de comecar qualquer fase.** Fases dependem umas das outras; contexto completo evita retrabalho.
- **Releia a secao da fase atual imediatamente antes de codar.**
- **NAO pule o checklist.** Cada item e validado antes de commit.
- **Se encontrar divergencia entre este plano e o RTF `Site gerenciador de clínicas odontológicas_médicas (1).rtf`, o RTF prevalece.** Atualize este plano quando isso acontecer.
- **Nao mude o schema sem criar nova migracao numerada.** Nunca editar migracoes ja aplicadas.
- **Rode o dev server e clique na feature depois de implementar.** Type-check nao valida logica de UI.
