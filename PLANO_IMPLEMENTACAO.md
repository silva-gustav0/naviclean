# NaviClean - Plano de Implementacao Completo
## Plataforma SaaS para Clinicas Odontologicas

---

## 1. VISAO GERAL DA ARQUITETURA

### Tech Stack
- **Frontend:** Next.js 14+ (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui (componentes prontos e acessiveis)
- **Backend/BaaS:** Supabase (Auth, Database PostgreSQL, Storage, Edge Functions, Realtime)
- **Deploy Frontend:** Vercel
- **Deploy Backend:** Supabase Cloud
- **Pagamentos:** Stripe (internacional) + API Mercado Pago/Asaas (Brasil)
- **Comunicacao:** WhatsApp Business API (via Evolution API ou Z-API), Resend (emails)
- **Mapas:** Google Maps Embed API
- **Analytics:** Google Analytics 4 + Posthog (product analytics)

### Estrutura de Pastas
```
naviclean/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Grupo: site publico (landing page)
│   │   │   ├── page.tsx              # Homepage/Landing
│   │   │   ├── servicos/page.tsx     # Pagina de servicos
│   │   │   ├── sobre/page.tsx        # Sobre a plataforma
│   │   │   ├── planos/page.tsx       # Planos e precos
│   │   │   ├── contato/page.tsx      # Contato
│   │   │   ├── blog/                 # Blog publico
│   │   │   │   ├── page.tsx          # Lista de posts
│   │   │   │   └── [slug]/page.tsx   # Post individual
│   │   │   └── layout.tsx            # Layout publico (navbar + footer)
│   │   ├── (auth)/                   # Grupo: autenticacao
│   │   │   ├── login/page.tsx
│   │   │   ├── cadastro/page.tsx
│   │   │   ├── recuperar-senha/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (portal)/                 # Grupo: portal do paciente (publico autenticado)
│   │   │   ├── agendamento/page.tsx  # Agendamento online pelo paciente
│   │   │   ├── meus-agendamentos/page.tsx
│   │   │   ├── meu-perfil/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Grupo: painel admin da clinica
│   │   │   ├── dashboard/page.tsx    # Visao geral
│   │   │   ├── agenda/page.tsx       # Calendario de agendamentos
│   │   │   ├── pacientes/
│   │   │   │   ├── page.tsx          # Lista de pacientes
│   │   │   │   └── [id]/page.tsx     # Ficha do paciente (prontuario)
│   │   │   ├── financeiro/
│   │   │   │   ├── page.tsx          # Visao geral financeira
│   │   │   │   ├── receitas/page.tsx
│   │   │   │   ├── despesas/page.tsx
│   │   │   │   └── relatorios/page.tsx
│   │   │   ├── equipe/page.tsx       # Gestao de profissionais
│   │   │   ├── tratamentos/page.tsx  # Catalogo de tratamentos/servicos
│   │   │   ├── marketing/
│   │   │   │   ├── page.tsx          # Campanhas e leads
│   │   │   │   └── blog/page.tsx     # Gerenciar posts do blog
│   │   │   ├── configuracoes/
│   │   │   │   ├── page.tsx          # Config geral da clinica
│   │   │   │   ├── horarios/page.tsx # Horarios de funcionamento
│   │   │   │   ├── notificacoes/page.tsx
│   │   │   │   └── plano/page.tsx    # Gerenciar assinatura
│   │   │   └── layout.tsx            # Layout dashboard (sidebar + topbar)
│   │   ├── api/                      # API Routes (Next.js)
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/route.ts
│   │   │   │   └── whatsapp/route.ts
│   │   │   ├── agendamento/route.ts
│   │   │   └── cron/
│   │   │       └── lembretes/route.ts
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── landing/                  # Componentes da landing page
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── CTA.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/                # Componentes do painel
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── AppointmentCalendar.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   ├── DentalChart.tsx       # Odontograma
│   │   │   ├── FinancialChart.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── shared/                   # Componentes compartilhados
│   │   │   ├── Navbar.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── FileUpload.tsx
│   │   └── forms/                    # Formularios reutilizaveis
│   │       ├── AppointmentForm.tsx
│   │       ├── PatientForm.tsx
│   │       ├── TransactionForm.tsx
│   │       └── ContactForm.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase browser client
│   │   │   ├── server.ts             # Supabase server client
│   │   │   ├── middleware.ts          # Auth middleware
│   │   │   └── admin.ts              # Supabase admin client (service role)
│   │   ├── stripe.ts                 # Stripe config
│   │   ├── whatsapp.ts               # WhatsApp API helper
│   │   ├── email.ts                  # Resend email helper
│   │   ├── utils.ts                  # Utilidades gerais
│   │   └── constants.ts              # Constantes do app
│   ├── hooks/
│   │   ├── useUser.ts                # Hook de usuario/sessao
│   │   ├── useClinic.ts              # Hook da clinica ativa
│   │   ├── useAppointments.ts
│   │   ├── usePatients.ts
│   │   └── useFinancial.ts
│   ├── types/
│   │   ├── database.ts               # Tipos gerados do Supabase
│   │   ├── appointment.ts
│   │   ├── patient.ts
│   │   ├── clinic.ts
│   │   └── financial.ts
│   └── middleware.ts                  # Next.js middleware (auth redirect)
├── supabase/
│   ├── migrations/                   # Migracoes SQL
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_functions.sql
│   ├── functions/                    # Edge Functions
│   │   ├── send-reminder/index.ts
│   │   └── process-payment/index.ts
│   └── config.toml
├── .env.local                        # Variaveis de ambiente (NAO commitar)
├── .env.example                      # Template de variaveis
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 2. BANCO DE DADOS - SCHEMA COMPLETO (Supabase/PostgreSQL)

### Migracao 001: Schema Inicial

```sql
-- ===========================================
-- EXTENSOES
-- ===========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- busca fuzzy

-- ===========================================
-- ENUM TYPES
-- ===========================================
CREATE TYPE user_role AS ENUM ('super_admin', 'clinic_owner', 'dentist', 'receptionist', 'patient');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'insurance');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE subscription_plan AS ENUM ('trial', 'basic', 'professional', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing');
CREATE TYPE notification_channel AS ENUM ('email', 'whatsapp', 'sms', 'push');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'converted', 'lost');
CREATE TYPE tooth_condition AS ENUM ('healthy', 'cavity', 'filled', 'crown', 'missing', 'implant', 'root_canal', 'extraction_needed');

-- ===========================================
-- TABELA: profiles (extensao do auth.users)
-- ===========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'patient',
    cpf TEXT UNIQUE,
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: clinics (cada clinica e um tenant)
-- ===========================================
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- URL amigavel: naviclean.com/c/minha-clinica
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    
    -- Endereco
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Configuracoes
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    currency TEXT DEFAULT 'BRL',
    appointment_duration_minutes INT DEFAULT 30,
    appointment_buffer_minutes INT DEFAULT 10,
    allow_online_booking BOOLEAN DEFAULT true,
    auto_confirm_appointments BOOLEAN DEFAULT false,
    
    -- Assinatura
    subscription_plan subscription_plan DEFAULT 'trial',
    subscription_status subscription_status DEFAULT 'trialing',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    
    -- SEO / Personalizacao
    meta_title TEXT,
    meta_description TEXT,
    primary_color TEXT DEFAULT '#2563EB',
    secondary_color TEXT DEFAULT '#10B981',
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: clinic_members (profissionais da clinica)
-- ===========================================
CREATE TABLE clinic_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'dentist',
    specialty TEXT, -- Ex: Ortodontia, Implantodontia
    cro TEXT, -- Registro no Conselho Regional de Odontologia
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, user_id)
);

-- ===========================================
-- TABELA: working_hours (horarios de funcionamento)
-- ===========================================
CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    member_id UUID REFERENCES clinic_members(id) ON DELETE CASCADE, -- NULL = horario da clinica
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=domingo
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(clinic_id, member_id, day_of_week)
);

-- ===========================================
-- TABELA: services (tratamentos/servicos)
-- ===========================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    price DECIMAL(10, 2),
    category TEXT, -- Ex: Prevencao, Estetica, Ortodontia
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: patients (pacientes da clinica)
-- ===========================================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id), -- vinculado a conta se existir
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    cpf TEXT,
    rg TEXT,
    date_of_birth DATE,
    gender TEXT,
    
    -- Endereco
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    
    -- Informacoes medicas
    medical_notes TEXT,
    allergies TEXT,
    medications TEXT,
    health_insurance TEXT,
    health_insurance_number TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: dental_chart (odontograma)
-- ===========================================
CREATE TABLE dental_chart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    tooth_number INT NOT NULL CHECK (tooth_number BETWEEN 11 AND 85), -- notacao FDI
    condition tooth_condition NOT NULL DEFAULT 'healthy',
    notes TEXT,
    updated_by UUID REFERENCES clinic_members(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id, tooth_number)
);

-- ===========================================
-- TABELA: appointments (agendamentos)
-- ===========================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id UUID NOT NULL REFERENCES clinic_members(id),
    service_id UUID REFERENCES services(id),
    
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    
    notes TEXT,
    internal_notes TEXT, -- notas visiveis so para equipe
    
    -- Lembretes
    reminder_sent BOOLEAN DEFAULT false,
    confirmation_sent BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: treatment_records (evolucao/prontuario)
-- ===========================================
CREATE TABLE treatment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    dentist_id UUID NOT NULL REFERENCES clinic_members(id),
    
    description TEXT NOT NULL,
    diagnosis TEXT,
    procedures_performed TEXT,
    prescriptions TEXT,
    tooth_numbers INT[], -- dentes envolvidos
    
    attachments TEXT[], -- URLs de arquivos/imagens
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: transactions (financeiro)
-- ===========================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    
    type transaction_type NOT NULL,
    category TEXT NOT NULL, -- Ex: Consulta, Material, Aluguel, Salario
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    
    payment_method payment_method,
    payment_status payment_status DEFAULT 'pending',
    
    due_date DATE,
    paid_at TIMESTAMPTZ,
    
    installments INT DEFAULT 1,
    installment_number INT DEFAULT 1,
    parent_transaction_id UUID REFERENCES transactions(id), -- para parcelamentos
    
    notes TEXT,
    receipt_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: treatment_plans (orcamentos/planos de tratamento)
-- ===========================================
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id UUID NOT NULL REFERENCES clinic_members(id),
    
    title TEXT NOT NULL,
    description TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    
    status TEXT DEFAULT 'pending', -- pending, approved, in_progress, completed, rejected
    approved_at TIMESTAMPTZ,
    
    valid_until DATE,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: treatment_plan_items
-- ===========================================
CREATE TABLE treatment_plan_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    tooth_number INT,
    description TEXT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed
    display_order INT DEFAULT 0
);

-- ===========================================
-- TABELA: blog_posts
-- ===========================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES clinic_members(id),
    
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    
    status blog_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, slug)
);

-- ===========================================
-- TABELA: leads (captacao de leads)
-- ===========================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    message TEXT,
    source TEXT, -- website, whatsapp, instagram, indicacao
    
    status lead_status DEFAULT 'new',
    notes TEXT,
    
    converted_patient_id UUID REFERENCES patients(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: notifications
-- ===========================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    patient_id UUID REFERENCES patients(id),
    
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel notification_channel NOT NULL,
    
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    reference_type TEXT, -- appointment, payment, lead, etc
    reference_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: files (documentos e anexos)
-- ===========================================
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT, -- image, document, xray, etc
    file_size INT,
    mime_type TEXT,
    
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: audit_log (log de auditoria)
-- ===========================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    
    action TEXT NOT NULL, -- create, update, delete, login, etc
    entity_type TEXT NOT NULL, -- patient, appointment, transaction, etc
    entity_id UUID,
    
    old_data JSONB,
    new_data JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDICES
-- ===========================================
CREATE INDEX idx_clinic_members_clinic ON clinic_members(clinic_id);
CREATE INDEX idx_patients_clinic ON patients(clinic_id);
CREATE INDEX idx_patients_name ON patients USING gin(full_name gin_trgm_ops);
CREATE INDEX idx_appointments_clinic_date ON appointments(clinic_id, date);
CREATE INDEX idx_appointments_dentist_date ON appointments(dentist_id, date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_transactions_clinic ON transactions(clinic_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_transactions_patient ON transactions(patient_id);
CREATE INDEX idx_treatment_records_patient ON treatment_records(patient_id);
CREATE INDEX idx_blog_posts_clinic_slug ON blog_posts(clinic_id, slug);
CREATE INDEX idx_leads_clinic ON leads(clinic_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_log_clinic ON audit_log(clinic_id);
CREATE INDEX idx_files_patient ON files(patient_id);

-- ===========================================
-- TRIGGERS: updated_at automatico
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON treatment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- FUNCAO: criar profile automaticamente ao cadastrar usuario
-- ===========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Migracao 002: Row Level Security (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_chart ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Funcao helper: verificar se usuario pertence a clinica
CREATE OR REPLACE FUNCTION is_clinic_member(clinic_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM clinic_members
        WHERE clinic_id = clinic_uuid
        AND user_id = auth.uid()
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funcao helper: verificar se usuario e dono da clinica
CREATE OR REPLACE FUNCTION is_clinic_owner(clinic_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM clinics
        WHERE id = clinic_uuid
        AND owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES: usuario ve/edita so o proprio perfil
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());

-- CLINICS: membros podem ver, dono pode editar
CREATE POLICY "clinics_select" ON clinics FOR SELECT USING (is_clinic_member(id) OR owner_id = auth.uid());
CREATE POLICY "clinics_insert" ON clinics FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "clinics_update" ON clinics FOR UPDATE USING (owner_id = auth.uid());

-- PATIENTS: membros da clinica podem CRUD
CREATE POLICY "patients_select" ON patients FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "patients_insert" ON patients FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "patients_update" ON patients FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "patients_delete" ON patients FOR DELETE USING (is_clinic_owner(clinic_id));

-- APPOINTMENTS: membros da clinica podem CRUD
CREATE POLICY "appointments_select" ON appointments FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "appointments_insert" ON appointments FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "appointments_update" ON appointments FOR UPDATE USING (is_clinic_member(clinic_id));

-- TRANSACTIONS: membros podem ver, owner/admin podem criar/editar
CREATE POLICY "transactions_select" ON transactions FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "transactions_insert" ON transactions FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "transactions_update" ON transactions FOR UPDATE USING (is_clinic_owner(clinic_id));

-- TREATMENT_RECORDS: membros podem CRUD
CREATE POLICY "records_select" ON treatment_records FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "records_insert" ON treatment_records FOR INSERT WITH CHECK (is_clinic_member(clinic_id));

-- BLOG_POSTS: membros podem gerenciar, publico pode ler publicados
CREATE POLICY "blog_select_public" ON blog_posts FOR SELECT USING (status = 'published' OR is_clinic_member(clinic_id));
CREATE POLICY "blog_insert" ON blog_posts FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "blog_update" ON blog_posts FOR UPDATE USING (is_clinic_member(clinic_id));

-- SERVICES: membros podem gerenciar, publico pode ler ativos
CREATE POLICY "services_select" ON services FOR SELECT USING (is_active = true OR is_clinic_member(clinic_id));
CREATE POLICY "services_insert" ON services FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "services_update" ON services FOR UPDATE USING (is_clinic_member(clinic_id));

-- Demais tabelas seguem mesmo padrao: membros da clinica tem acesso
CREATE POLICY "clinic_members_select" ON clinic_members FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "working_hours_select" ON working_hours FOR SELECT USING (is_clinic_member(clinic_id) OR TRUE); -- publico para agendamento
CREATE POLICY "dental_chart_select" ON dental_chart FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "dental_chart_upsert" ON dental_chart FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "dental_chart_update" ON dental_chart FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "treatment_plans_select" ON treatment_plans FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "treatment_plans_insert" ON treatment_plans FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "treatment_plan_items_select" ON treatment_plan_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM treatment_plans tp WHERE tp.id = plan_id AND is_clinic_member(tp.clinic_id))
);
CREATE POLICY "leads_select" ON leads FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (TRUE); -- qualquer um pode criar lead (formulario publico)
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "files_select" ON files FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "files_insert" ON files FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "audit_log_select" ON audit_log FOR SELECT USING (is_clinic_owner(clinic_id));
```

---

## 3. PLANO DE EXECUCAO POR FASES

### FASE 1: Fundacao (Sonnet deve executar primeiro)
**Objetivo:** Projeto base funcional com auth e estrutura

**Passo 1.1 - Inicializar projeto**
1. `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. `npx shadcn@latest init` (estilo: default, cor: blue, CSS variables: yes)
3. Instalar dependencias:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   npm install @stripe/stripe-js stripe
   npm install react-hook-form @hookform/resolvers zod
   npm install date-fns lucide-react
   npm install recharts
   npm install @tanstack/react-table
   npm install zustand
   npm install resend
   npm install sonner
   ```
4. Instalar componentes shadcn necessarios:
   ```bash
   npx shadcn@latest add button card input label select textarea dialog sheet dropdown-menu avatar badge calendar popover command table tabs toast separator skeleton switch checkbox radio-group scroll-area alert alert-dialog form navigation-menu accordion tooltip
   ```

**Passo 1.2 - Configurar Supabase**
1. Criar projeto no Supabase Dashboard
2. Configurar `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_ROLE_KEY=xxx
   STRIPE_SECRET_KEY=xxx
   STRIPE_WEBHOOK_SECRET=xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
   RESEND_API_KEY=xxx
   WHATSAPP_API_URL=xxx
   WHATSAPP_API_TOKEN=xxx
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. Criar arquivos `src/lib/supabase/client.ts` e `src/lib/supabase/server.ts`
4. Criar `src/middleware.ts` para refresh de sessao
5. Executar migracoes SQL no Supabase (schema + RLS)

**Passo 1.3 - Layout e Auth**
1. Criar layout root com providers (Supabase, Theme, Toaster)
2. Implementar paginas de login, cadastro, recuperar senha
3. Implementar middleware de protecao de rotas
4. Fluxo: cadastro → criar clinica → redirect para dashboard

### FASE 2: Landing Page Publica
**Objetivo:** Site publico vendedor para atrair clinicas

**Passo 2.1 - Layout publico**
- Navbar responsiva (logo, links, CTA "Comece Gratis")
- Footer completo (links, contato, redes sociais, LGPD)

**Passo 2.2 - Homepage (Landing Page)**
- Hero: titulo impactante + subtitulo + CTA + imagem/mockup do dashboard
- Logos de clinicas parceiras (social proof)
- Features: grid de funcionalidades com icones (agendamento, prontuario, financeiro, etc)
- Como funciona: 3 steps (Cadastre, Configure, Gerencie)
- Servicos/Modulos do sistema
- Depoimentos/testimonials com foto e nome
- Planos e precos (tabela comparativa)
- FAQ accordion
- CTA final

**Passo 2.3 - Paginas complementares**
- `/servicos` - detalhes de cada modulo
- `/sobre` - historia, missao, equipe
- `/planos` - pagina dedicada de precos
- `/contato` - formulario + mapa + WhatsApp
- `/blog` - listagem de artigos (SEO)
- `/blog/[slug]` - artigo individual

### FASE 3: Dashboard - Core
**Objetivo:** Painel administrativo funcional

**Passo 3.1 - Layout do Dashboard**
- Sidebar colapsavel com navegacao (icones + labels)
  - Dashboard, Agenda, Pacientes, Financeiro, Equipe, Tratamentos, Marketing, Config
- Topbar: busca global, notificacoes, perfil/avatar, seletor de clinica
- Responsivo: sidebar vira sheet no mobile

**Passo 3.2 - Pagina Dashboard (visao geral)**
- Cards de metricas: agendamentos hoje, pacientes ativos, receita do mes, taxa de comparecimento
- Grafico de receitas (ultimos 6 meses) - recharts
- Proximos agendamentos do dia (lista)
- Atividades recentes (timeline)
- Aniversariantes do mes

**Passo 3.3 - Modulo de Agenda**
- Calendario visual (dia/semana/mes)
- Criar agendamento: modal com formulario (paciente, dentista, servico, data/hora)
- Visualizar detalhes do agendamento
- Drag & drop para reagendar
- Filtro por dentista
- Status com cores (agendado=azul, confirmado=verde, concluido=cinza, cancelado=vermelho)

### FASE 4: Gestao de Pacientes
**Objetivo:** CRUD completo de pacientes com prontuario

**Passo 4.1 - Lista de pacientes**
- DataTable com busca, filtros, paginacao
- Colunas: nome, telefone, ultimo agendamento, status
- Acoes rapidas: agendar, ver ficha, WhatsApp

**Passo 4.2 - Ficha do paciente (`/pacientes/[id]`)**
- Tabs: Dados Pessoais | Prontuario | Odontograma | Agendamentos | Financeiro | Documentos
- **Dados Pessoais:** formulario completo editavel
- **Prontuario:** timeline de evolucoes/atendimentos com rich text
- **Odontograma:** componente visual interativo dos dentes (SVG) com clique para marcar condicao
- **Agendamentos:** historico e proximos
- **Financeiro:** debitos, pagamentos, orcamentos
- **Documentos:** upload de arquivos (RX, contratos, termos) via Supabase Storage

### FASE 5: Financeiro
**Objetivo:** Controle financeiro completo

**Passo 5.1 - Visao geral**
- Cards: receita total, despesas, saldo, contas a receber
- Grafico receita vs despesa (mensal)
- Grafico por categoria (pizza)

**Passo 5.2 - Receitas e Despesas**
- Tabela com filtros por periodo, categoria, status de pagamento
- Modal para adicionar transacao
- Categorias customizaveis
- Parcelamento de pagamentos
- Registro de metodo de pagamento

**Passo 5.3 - Orcamentos/Planos de Tratamento**
- Criar orcamento para paciente com itens de servico
- Aplicar desconto
- Enviar orcamento por WhatsApp/email
- Status: pendente → aprovado → em andamento → concluido

**Passo 5.4 - Relatorios**
- Relatorio mensal/anual
- Fluxo de caixa
- Receita por dentista
- Receita por servico
- Exportar PDF/Excel

### FASE 6: Equipe e Tratamentos
**Objetivo:** Gerenciar profissionais e catalogo de servicos

**Passo 6.1 - Equipe**
- Lista de profissionais da clinica
- Adicionar membro (convite por email)
- Definir role (dentista, recepcionista)
- Gerenciar especialidade e CRO
- Horarios individuais de atendimento

**Passo 6.2 - Catalogo de Tratamentos**
- CRUD de servicos/tratamentos
- Nome, descricao, duracao, preco
- Categorias (prevencao, estetica, cirurgia, ortodontia, etc)
- Ordenacao por drag & drop
- Ativar/desativar servico

### FASE 7: Marketing e Blog
**Objetivo:** Ferramentas de captacao e conteudo

**Passo 7.1 - Gestao de Leads**
- Tabela de leads capturados (formulario do site, WhatsApp)
- Status: novo → contatado → convertido/perdido
- Converter lead em paciente

**Passo 7.2 - Blog**
- Editor de posts com rich text (Tiptap ou similar)
- Upload de imagem de capa
- Tags e categorias
- SEO: meta title, meta description
- Status: rascunho → publicado → arquivado

### FASE 8: Notificacoes e Integracoes
**Objetivo:** Comunicacao automatizada

**Passo 8.1 - Lembretes automaticos**
- Lembrete de agendamento (24h antes) via WhatsApp
- Confirmacao de agendamento via WhatsApp
- Email de boas-vindas ao paciente
- Notificacao de novo lead

**Passo 8.2 - Integracoes**
- WhatsApp Business API: enviar mensagens, botao flutuante no site
- Stripe/Mercado Pago: cobranca de assinatura da clinica
- Resend: emails transacionais
- Google Maps: embed na pagina de contato

### FASE 9: Portal do Paciente
**Objetivo:** Area do paciente para autoatendimento

- Agendamento online (escolher dentista, servico, data/hora)
- Ver/cancelar agendamentos
- Ver orcamentos
- Atualizar dados pessoais

### FASE 10: Planos, Assinatura e Multi-tenancy
**Objetivo:** Monetizacao SaaS

**Passo 10.1 - Planos**
- Trial: 14 dias gratis, todas as features
- Basic (R$97/mes): 1 dentista, 100 pacientes, agendamento + financeiro basico
- Professional (R$197/mes): 5 dentistas, pacientes ilimitados, todas as features
- Enterprise (R$397/mes): ilimitado, API, suporte prioritario, white-label

**Passo 10.2 - Checkout e billing**
- Integracao Stripe Checkout para assinatura
- Webhooks para atualizar status
- Pagina de gerenciamento do plano (upgrade/downgrade/cancelar)
- Bloqueio de features por plano (middleware de verificacao)

**Passo 10.3 - Multi-tenancy**
- Cada clinica isolada por clinic_id
- RLS garante isolamento de dados
- Slug unico para URL publica da clinica
- Switch de clinica no dashboard (para usuarios em multiplas clinicas)

### FASE 11: SEO, Performance e Deploy
**Objetivo:** Pronto para producao

**Passo 11.1 - SEO**
- Metadata dinamica em todas as paginas (generateMetadata)
- Open Graph images
- Sitemap.xml dinamico
- robots.txt
- Schema.org markup (LocalBusiness para clinicas)
- Paginas de blog otimizadas

**Passo 11.2 - Performance**
- Image optimization (next/image)
- Lazy loading de componentes pesados
- Suspense boundaries
- ISR para blog posts
- Edge runtime onde possivel

**Passo 11.3 - Deploy**
- Vercel: conectar repo, configurar env vars
- Supabase: projeto em producao
- Dominio customizado
- SSL automatico (Vercel)
- Monitoring: Vercel Analytics + Sentry

---

## 4. CONFIGURACOES IMPORTANTES

### Variaveis de Ambiente (.env.example)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email (Resend)
RESEND_API_KEY=

# WhatsApp
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NaviClean
```

### Supabase Storage Buckets
- `avatars` - fotos de perfil (publico)
- `clinic-logos` - logos das clinicas (publico)
- `patient-files` - documentos de pacientes (privado, RLS)
- `blog-images` - imagens dos posts (publico)
- `treatment-images` - fotos de tratamentos (privado, RLS)

---

## 5. ORDEM DE EXECUCAO PARA O SONNET

O Sonnet deve executar na seguinte ordem, cada fase como uma sessao:

1. **Sessao 1:** FASE 1 (Fundacao) - setup do projeto, Supabase, auth
2. **Sessao 2:** FASE 2 (Landing Page) - site publico completo
3. **Sessao 3:** FASE 3 (Dashboard Core) - layout + dashboard + agenda
4. **Sessao 4:** FASE 4 (Pacientes) - CRUD + prontuario + odontograma
5. **Sessao 5:** FASE 5 (Financeiro) - transacoes + orcamentos + relatorios
6. **Sessao 6:** FASE 6 (Equipe + Tratamentos) - profissionais + catalogo
7. **Sessao 7:** FASE 7 (Marketing + Blog) - leads + editor de blog
8. **Sessao 8:** FASE 8 (Notificacoes) - WhatsApp + email + lembretes
9. **Sessao 9:** FASE 9 (Portal do Paciente) - agendamento online
10. **Sessao 10:** FASE 10 (Planos + Billing) - Stripe + multi-tenancy
11. **Sessao 11:** FASE 11 (SEO + Deploy) - otimizacao + producao

---

## 6. INSTRUCOES PARA O SONNET

Ao executar cada fase, o Sonnet deve:

1. **Ler este plano completo** antes de comecar qualquer fase
2. **Seguir a estrutura de pastas** definida na secao 1
3. **Usar TypeScript strict** em todos os arquivos
4. **Usar Server Components** por padrao, Client Components so quando necessario (interatividade)
5. **Validar formularios** com zod + react-hook-form
6. **Usar shadcn/ui** para todos os componentes de UI
7. **Implementar loading states** com Skeleton do shadcn
8. **Implementar error boundaries** nas paginas principais
9. **Seguir as convencoes do Next.js App Router** (loading.tsx, error.tsx, not-found.tsx)
10. **Gerar tipos do Supabase** com `npx supabase gen types typescript`
11. **Testar cada modulo** antes de seguir para o proximo
12. **Commitar ao final de cada fase** com mensagem descritiva
