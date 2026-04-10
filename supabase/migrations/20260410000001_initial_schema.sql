-- ===========================================
-- EXTENSOES
-- ===========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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
-- TABELA: clinics
-- ===========================================
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    website TEXT,

    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    timezone TEXT DEFAULT 'America/Sao_Paulo',
    currency TEXT DEFAULT 'BRL',
    appointment_duration_minutes INT DEFAULT 30,
    appointment_buffer_minutes INT DEFAULT 10,
    allow_online_booking BOOLEAN DEFAULT true,
    auto_confirm_appointments BOOLEAN DEFAULT false,

    subscription_plan subscription_plan DEFAULT 'trial',
    subscription_status subscription_status DEFAULT 'trialing',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),

    meta_title TEXT,
    meta_description TEXT,
    primary_color TEXT DEFAULT '#2563EB',
    secondary_color TEXT DEFAULT '#10B981',

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: clinic_members
-- ===========================================
CREATE TABLE clinic_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'dentist',
    specialty TEXT,
    cro TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, user_id)
);

-- ===========================================
-- TABELA: working_hours
-- ===========================================
CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    member_id UUID REFERENCES clinic_members(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(clinic_id, member_id, day_of_week)
);

-- ===========================================
-- TABELA: services
-- ===========================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    price DECIMAL(10, 2),
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: patients
-- ===========================================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    cpf TEXT,
    rg TEXT,
    date_of_birth DATE,
    gender TEXT,

    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,

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
-- TABELA: dental_chart
-- ===========================================
CREATE TABLE dental_chart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    tooth_number INT NOT NULL CHECK (tooth_number BETWEEN 11 AND 85),
    condition tooth_condition NOT NULL DEFAULT 'healthy',
    notes TEXT,
    updated_by UUID REFERENCES clinic_members(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id, tooth_number)
);

-- ===========================================
-- TABELA: appointments
-- ===========================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id UUID NOT NULL REFERENCES clinic_members(id),
    service_id UUID REFERENCES services(id),

    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status DEFAULT 'scheduled',

    notes TEXT,
    internal_notes TEXT,

    reminder_sent BOOLEAN DEFAULT false,
    confirmation_sent BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: treatment_records
-- ===========================================
CREATE TABLE treatment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    dentist_id UUID NOT NULL REFERENCES clinic_members(id),

    description TEXT NOT NULL,
    diagnosis TEXT,
    procedures_performed TEXT,
    prescriptions TEXT,
    tooth_numbers INT[],
    attachments TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: transactions
-- ===========================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),

    type transaction_type NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,

    payment_method payment_method,
    payment_status payment_status DEFAULT 'pending',

    due_date DATE,
    paid_at TIMESTAMPTZ,

    installments INT DEFAULT 1,
    installment_number INT DEFAULT 1,
    parent_transaction_id UUID REFERENCES transactions(id),

    notes TEXT,
    receipt_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: treatment_plans
-- ===========================================
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id UUID NOT NULL REFERENCES clinic_members(id),

    title TEXT NOT NULL,
    description TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,

    status TEXT DEFAULT 'pending',
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    tooth_number INT,
    description TEXT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    display_order INT DEFAULT 0
);

-- ===========================================
-- TABELA: blog_posts
-- ===========================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
-- TABELA: leads
-- ===========================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    message TEXT,
    source TEXT,

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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    patient_id UUID REFERENCES patients(id),

    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel notification_channel NOT NULL,

    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,

    reference_type TEXT,
    reference_id UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: files
-- ===========================================
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),

    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INT,
    mime_type TEXT,

    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABELA: audit_log
-- ===========================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),

    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
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
-- TRIGGER: updated_at automatico
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
-- FUNCAO + TRIGGER: criar profile ao cadastrar usuario
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
