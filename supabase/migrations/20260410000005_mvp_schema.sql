-- ===========================================
-- FASE 0 — MVP Schema Extensions
-- ===========================================

-- Expande user_role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'doctor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'independent_professional';

-- Status de consulta alinhado ao RTF (cores)
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'waiting_room';
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'awaiting_payment';

-- Tipos novos
CREATE TYPE professional_affiliation AS ENUM ('independent', 'affiliated');
CREATE TYPE price_table_type AS ENUM ('private', 'insurance');
CREATE TYPE stock_movement_type AS ENUM ('entry', 'exit', 'adjustment', 'expired');
CREATE TYPE prescription_type AS ENUM ('recipe', 'certificate', 'referral');
CREATE TYPE evolution_status AS ENUM ('draft', 'signed');

-- =========================
-- Convenios (Insurance plans)
-- =========================
CREATE TABLE insurance_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ans_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Tabelas de preco
-- =========================
CREATE TABLE price_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type price_table_type NOT NULL,
  insurance_plan_id UUID REFERENCES insurance_plans(id) ON DELETE SET NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE service_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  price_table_id UUID NOT NULL REFERENCES price_tables(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE(service_id, price_table_id)
);

ALTER TABLE patients ADD COLUMN IF NOT EXISTS default_price_table_id UUID REFERENCES price_tables(id) ON DELETE SET NULL;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS anamnesis_completed_at TIMESTAMPTZ;

CREATE TABLE patient_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES clinic_members(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  service_category TEXT,
  price_table_id UUID REFERENCES price_tables(id) ON DELETE CASCADE,
  percentage DECIMAL(5,2) NOT NULL,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE direct_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  percentage DECIMAL(5,2),
  fixed_amount DECIMAL(10,2),
  applies_to_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  applies_to_payment_method payment_method,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES clinic_members(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  gross_amount DECIMAL(10,2) NOT NULL,
  direct_costs_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  released_at TIMESTAMPTZ,
  paid_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Anamnese
-- =========================
CREATE TABLE anamnesis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  history_of_present_illness TEXT,
  chief_complaint TEXT,
  pain_currently BOOLEAN,
  pain_level INT CHECK (pain_level BETWEEN 0 AND 10),
  has_cardiovascular BOOLEAN,
  cardiovascular_notes TEXT,
  has_diabetes BOOLEAN,
  diabetes_type TEXT,
  has_coagulation_issues BOOLEAN,
  has_allergies BOOLEAN,
  allergies_list TEXT,
  uses_continuous_medication BOOLEAN,
  medication_list TEXT,
  has_cancer_history BOOLEAN,
  has_infectious_disease BOOLEAN,
  infectious_disease_notes TEXT,
  smokes BOOLEAN,
  smoking_status TEXT,
  smoking_stopped_years INT,
  consumes_alcohol BOOLEAN,
  is_pregnant BOOLEAN,
  is_breastfeeding BOOLEAN,
  filled_by TEXT NOT NULL DEFAULT 'staff',
  filled_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE anamnesis_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE tooth_face_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number INT NOT NULL,
  face TEXT NOT NULL,
  condition tooth_condition NOT NULL,
  mark_status TEXT NOT NULL DEFAULT 'planned',
  color_hex TEXT,
  notes TEXT,
  created_by UUID REFERENCES clinic_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tooth_symbols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number INT NOT NULL,
  symbol TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  created_by UUID REFERENCES clinic_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(patient_id, tooth_number, symbol)
);

-- =========================
-- Evolucao clinica com assinatura
-- =========================
CREATE TABLE clinical_evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  author_member_id UUID NOT NULL REFERENCES clinic_members(id),
  procedures_performed TEXT NOT NULL,
  materials_used TEXT,
  tooth_numbers INT[],
  observations TEXT,
  status evolution_status NOT NULL DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  signed_by_name TEXT,
  signed_by_cro TEXT,
  signed_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evolution_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evolution_id UUID NOT NULL REFERENCES clinical_evolutions(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  attachment_type TEXT NOT NULL,
  UNIQUE(evolution_id, file_id)
);

-- =========================
-- Prescricoes digitais
-- =========================
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  evolution_id UUID REFERENCES clinical_evolutions(id) ON DELETE SET NULL,
  author_member_id UUID NOT NULL REFERENCES clinic_members(id),
  type prescription_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  days_off INT,
  pdf_url TEXT,
  signed_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Fila de espera / check-in
-- =========================
CREATE TABLE appointment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  unit TEXT NOT NULL,
  minimum_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stock_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  stock_item_id UUID NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  batch_number TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  expiry_date DATE,
  nfe_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  stock_item_id UUID NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES stock_batches(id) ON DELETE SET NULL,
  type stock_movement_type NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  reason TEXT,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nfe_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  nfe_key TEXT UNIQUE NOT NULL,
  supplier_name TEXT,
  issue_date DATE,
  total_amount DECIMAL(10,2),
  xml_url TEXT,
  status TEXT DEFAULT 'imported',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Avaliacoes
-- =========================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  ADD COLUMN IF NOT EXISTS rqe TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS bio_long TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS procedures_performed TEXT[];

ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS cnpj TEXT,
  ADD COLUMN IF NOT EXISTS legal_name TEXT,
  ADD COLUMN IF NOT EXISTS technical_responsible_name TEXT,
  ADD COLUMN IF NOT EXISTS technical_responsible_cro TEXT,
  ADD COLUMN IF NOT EXISTS bank_info JSONB;

-- =========================
-- Triggers
-- =========================
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

-- =========================
-- Indices adicionais
-- =========================
CREATE INDEX idx_clinical_evolutions_patient ON clinical_evolutions(patient_id);
CREATE INDEX idx_clinical_evolutions_clinic ON clinical_evolutions(clinic_id);
CREATE INDEX idx_tooth_face_marks_patient ON tooth_face_marks(patient_id);
CREATE INDEX idx_tooth_symbols_patient ON tooth_symbols(patient_id);
CREATE INDEX idx_anamnesis_patient ON anamnesis(patient_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_stock_items_clinic ON stock_items(clinic_id);
CREATE INDEX idx_stock_batches_item ON stock_batches(stock_item_id);
CREATE INDEX idx_stock_movements_item ON stock_movements(stock_item_id);
CREATE INDEX idx_commissions_member ON commissions(member_id);
CREATE INDEX idx_commissions_transaction ON commissions(transaction_id);
CREATE INDEX idx_reviews_clinic ON reviews(clinic_id);
CREATE INDEX idx_appointment_events_appointment ON appointment_events(appointment_id);

-- Storage buckets adicionais
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('clinic-covers', 'clinic-covers', true, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('prescriptions', 'prescriptions', false, 5242880, ARRAY['application/pdf']),
  ('nfe-xml', 'nfe-xml', false, 5242880, ARRAY['text/xml','application/xml'])
ON CONFLICT (id) DO NOTHING;
