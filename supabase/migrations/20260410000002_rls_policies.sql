-- ===========================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- ===========================================
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

-- ===========================================
-- FUNCOES HELPER
-- ===========================================
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

-- ===========================================
-- PROFILES
-- ===========================================
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- ===========================================
-- CLINICS
-- ===========================================
CREATE POLICY "clinics_select" ON clinics FOR SELECT USING (is_clinic_member(id) OR owner_id = auth.uid());
CREATE POLICY "clinics_insert" ON clinics FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "clinics_update" ON clinics FOR UPDATE USING (owner_id = auth.uid());

-- ===========================================
-- CLINIC_MEMBERS
-- ===========================================
CREATE POLICY "clinic_members_select" ON clinic_members FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "clinic_members_insert" ON clinic_members FOR INSERT WITH CHECK (is_clinic_owner(clinic_id));
CREATE POLICY "clinic_members_update" ON clinic_members FOR UPDATE USING (is_clinic_owner(clinic_id));

-- ===========================================
-- WORKING_HOURS (publico para agendamento online)
-- ===========================================
CREATE POLICY "working_hours_select" ON working_hours FOR SELECT USING (true);
CREATE POLICY "working_hours_insert" ON working_hours FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "working_hours_update" ON working_hours FOR UPDATE USING (is_clinic_member(clinic_id));

-- ===========================================
-- SERVICES (publico pode ver ativos)
-- ===========================================
CREATE POLICY "services_select" ON services FOR SELECT USING (is_active = true OR is_clinic_member(clinic_id));
CREATE POLICY "services_insert" ON services FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "services_update" ON services FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "services_delete" ON services FOR DELETE USING (is_clinic_owner(clinic_id));

-- ===========================================
-- PATIENTS
-- ===========================================
CREATE POLICY "patients_select" ON patients FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "patients_insert" ON patients FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "patients_update" ON patients FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "patients_delete" ON patients FOR DELETE USING (is_clinic_owner(clinic_id));

-- ===========================================
-- DENTAL_CHART
-- ===========================================
CREATE POLICY "dental_chart_select" ON dental_chart FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "dental_chart_insert" ON dental_chart FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "dental_chart_update" ON dental_chart FOR UPDATE USING (is_clinic_member(clinic_id));

-- ===========================================
-- APPOINTMENTS
-- ===========================================
CREATE POLICY "appointments_select" ON appointments FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "appointments_insert" ON appointments FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "appointments_update" ON appointments FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "appointments_delete" ON appointments FOR DELETE USING (is_clinic_owner(clinic_id));

-- ===========================================
-- TREATMENT_RECORDS
-- ===========================================
CREATE POLICY "records_select" ON treatment_records FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "records_insert" ON treatment_records FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "records_update" ON treatment_records FOR UPDATE USING (is_clinic_member(clinic_id));

-- ===========================================
-- TRANSACTIONS
-- ===========================================
CREATE POLICY "transactions_select" ON transactions FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "transactions_insert" ON transactions FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "transactions_update" ON transactions FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "transactions_delete" ON transactions FOR DELETE USING (is_clinic_owner(clinic_id));

-- ===========================================
-- TREATMENT_PLANS
-- ===========================================
CREATE POLICY "treatment_plans_select" ON treatment_plans FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "treatment_plans_insert" ON treatment_plans FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "treatment_plans_update" ON treatment_plans FOR UPDATE USING (is_clinic_member(clinic_id));

-- ===========================================
-- TREATMENT_PLAN_ITEMS
-- ===========================================
CREATE POLICY "plan_items_select" ON treatment_plan_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM treatment_plans tp WHERE tp.id = plan_id AND is_clinic_member(tp.clinic_id))
);
CREATE POLICY "plan_items_insert" ON treatment_plan_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM treatment_plans tp WHERE tp.id = plan_id AND is_clinic_member(tp.clinic_id))
);
CREATE POLICY "plan_items_update" ON treatment_plan_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM treatment_plans tp WHERE tp.id = plan_id AND is_clinic_member(tp.clinic_id))
);

-- ===========================================
-- BLOG_POSTS (publico pode ver posts publicados)
-- ===========================================
CREATE POLICY "blog_select_public" ON blog_posts FOR SELECT USING (status = 'published' OR is_clinic_member(clinic_id));
CREATE POLICY "blog_insert" ON blog_posts FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "blog_update" ON blog_posts FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "blog_delete" ON blog_posts FOR DELETE USING (is_clinic_owner(clinic_id));

-- ===========================================
-- LEADS (qualquer um pode criar via formulario publico)
-- ===========================================
CREATE POLICY "leads_select" ON leads FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_update" ON leads FOR UPDATE USING (is_clinic_member(clinic_id));

-- ===========================================
-- NOTIFICATIONS
-- ===========================================
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (user_id = auth.uid() OR is_clinic_member(clinic_id));
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- ===========================================
-- FILES
-- ===========================================
CREATE POLICY "files_select" ON files FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "files_insert" ON files FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "files_delete" ON files FOR DELETE USING (is_clinic_member(clinic_id));

-- ===========================================
-- AUDIT_LOG (apenas owner visualiza)
-- ===========================================
CREATE POLICY "audit_log_select" ON audit_log FOR SELECT USING (is_clinic_owner(clinic_id));
CREATE POLICY "audit_log_insert" ON audit_log FOR INSERT WITH CHECK (true);
