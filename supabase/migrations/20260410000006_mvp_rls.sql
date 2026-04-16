-- ===========================================
-- FASE 0 — RLS para novas tabelas
-- ===========================================

ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesis ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesis_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE tooth_face_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tooth_symbols ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_evolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfe_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- insurance_plans
CREATE POLICY "insurance_plans_select" ON insurance_plans FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "insurance_plans_insert" ON insurance_plans FOR INSERT WITH CHECK (is_clinic_owner(clinic_id));
CREATE POLICY "insurance_plans_update" ON insurance_plans FOR UPDATE USING (is_clinic_owner(clinic_id));
CREATE POLICY "insurance_plans_delete" ON insurance_plans FOR DELETE USING (is_clinic_owner(clinic_id));

-- price_tables
CREATE POLICY "price_tables_select" ON price_tables FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "price_tables_insert" ON price_tables FOR INSERT WITH CHECK (is_clinic_owner(clinic_id));
CREATE POLICY "price_tables_update" ON price_tables FOR UPDATE USING (is_clinic_owner(clinic_id));

-- service_prices
CREATE POLICY "service_prices_select" ON service_prices FOR SELECT USING (
  EXISTS (SELECT 1 FROM price_tables pt WHERE pt.id = price_table_id AND is_clinic_member(pt.clinic_id))
);
CREATE POLICY "service_prices_insert" ON service_prices FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM price_tables pt WHERE pt.id = price_table_id AND is_clinic_owner(pt.clinic_id))
);
CREATE POLICY "service_prices_update" ON service_prices FOR UPDATE USING (
  EXISTS (SELECT 1 FROM price_tables pt WHERE pt.id = price_table_id AND is_clinic_owner(pt.clinic_id))
);

-- patient_insurance
CREATE POLICY "patient_insurance_select" ON patient_insurance FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_id AND is_clinic_member(p.clinic_id))
);
CREATE POLICY "patient_insurance_insert" ON patient_insurance FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_id AND is_clinic_member(p.clinic_id))
);
CREATE POLICY "patient_insurance_update" ON patient_insurance FOR UPDATE USING (
  EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_id AND is_clinic_member(p.clinic_id))
);

-- commission_rules
CREATE POLICY "commission_rules_select" ON commission_rules FOR SELECT USING (is_clinic_owner(clinic_id));
CREATE POLICY "commission_rules_insert" ON commission_rules FOR INSERT WITH CHECK (is_clinic_owner(clinic_id));
CREATE POLICY "commission_rules_update" ON commission_rules FOR UPDATE USING (is_clinic_owner(clinic_id));
CREATE POLICY "commission_rules_delete" ON commission_rules FOR DELETE USING (is_clinic_owner(clinic_id));

-- direct_costs
CREATE POLICY "direct_costs_select" ON direct_costs FOR SELECT USING (is_clinic_owner(clinic_id));
CREATE POLICY "direct_costs_insert" ON direct_costs FOR INSERT WITH CHECK (is_clinic_owner(clinic_id));
CREATE POLICY "direct_costs_update" ON direct_costs FOR UPDATE USING (is_clinic_owner(clinic_id));

-- commissions: owner ve tudo, membro ve as proprias
CREATE POLICY "commissions_select" ON commissions FOR SELECT USING (
  is_clinic_owner(clinic_id) OR
  EXISTS (SELECT 1 FROM clinic_members cm WHERE cm.id = member_id AND cm.user_id = auth.uid())
);
CREATE POLICY "commissions_insert" ON commissions FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "commissions_update" ON commissions FOR UPDATE USING (is_clinic_owner(clinic_id));

-- anamnesis
CREATE POLICY "anamnesis_select" ON anamnesis FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "anamnesis_insert" ON anamnesis FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "anamnesis_update" ON anamnesis FOR UPDATE USING (is_clinic_member(clinic_id));

-- anamnesis_tokens: insert por membro, select publico via token (validado no app)
CREATE POLICY "anamnesis_tokens_select" ON anamnesis_tokens FOR SELECT USING (true);
CREATE POLICY "anamnesis_tokens_insert" ON anamnesis_tokens FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "anamnesis_tokens_update" ON anamnesis_tokens FOR UPDATE USING (true);

-- tooth_face_marks
CREATE POLICY "tooth_face_marks_select" ON tooth_face_marks FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "tooth_face_marks_insert" ON tooth_face_marks FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "tooth_face_marks_update" ON tooth_face_marks FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "tooth_face_marks_delete" ON tooth_face_marks FOR DELETE USING (is_clinic_member(clinic_id));

-- tooth_symbols
CREATE POLICY "tooth_symbols_select" ON tooth_symbols FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "tooth_symbols_insert" ON tooth_symbols FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "tooth_symbols_update" ON tooth_symbols FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY "tooth_symbols_delete" ON tooth_symbols FOR DELETE USING (is_clinic_member(clinic_id));

-- clinical_evolutions: insert livre para membros; update bloqueado pelo trigger apos assinatura
CREATE POLICY "clinical_evolutions_select" ON clinical_evolutions FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "clinical_evolutions_insert" ON clinical_evolutions FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "clinical_evolutions_update" ON clinical_evolutions FOR UPDATE USING (is_clinic_member(clinic_id));

-- evolution_attachments
CREATE POLICY "evolution_attachments_select" ON evolution_attachments FOR SELECT USING (
  EXISTS (SELECT 1 FROM clinical_evolutions ce WHERE ce.id = evolution_id AND is_clinic_member(ce.clinic_id))
);
CREATE POLICY "evolution_attachments_insert" ON evolution_attachments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM clinical_evolutions ce WHERE ce.id = evolution_id AND is_clinic_member(ce.clinic_id))
);

-- prescriptions
CREATE POLICY "prescriptions_select" ON prescriptions FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "prescriptions_insert" ON prescriptions FOR INSERT WITH CHECK (is_clinic_member(clinic_id));

-- appointment_events
CREATE POLICY "appointment_events_select" ON appointment_events FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "appointment_events_insert" ON appointment_events FOR INSERT WITH CHECK (true);

-- stock_items
CREATE POLICY "stock_items_select" ON stock_items FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "stock_items_insert" ON stock_items FOR INSERT WITH CHECK (is_clinic_owner(clinic_id));
CREATE POLICY "stock_items_update" ON stock_items FOR UPDATE USING (is_clinic_owner(clinic_id));

-- stock_batches
CREATE POLICY "stock_batches_select" ON stock_batches FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "stock_batches_insert" ON stock_batches FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY "stock_batches_update" ON stock_batches FOR UPDATE USING (is_clinic_member(clinic_id));

-- stock_movements
CREATE POLICY "stock_movements_select" ON stock_movements FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "stock_movements_insert" ON stock_movements FOR INSERT WITH CHECK (is_clinic_member(clinic_id));

-- nfe_imports
CREATE POLICY "nfe_imports_select" ON nfe_imports FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY "nfe_imports_insert" ON nfe_imports FOR INSERT WITH CHECK (is_clinic_owner(clinic_id));

-- reviews: insert por paciente autenticado, select publico para publicados
CREATE POLICY "reviews_select_public" ON reviews FOR SELECT USING (is_published = true OR is_clinic_member(clinic_id));
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (is_clinic_owner(clinic_id));

-- Portal publico: clinics e clinic_members visiveis para anonimos se ativo
CREATE POLICY "clinics_select_public" ON clinics FOR SELECT USING (
  is_active = true OR is_clinic_member(id) OR owner_id = auth.uid()
);

-- Storage RLS para novos buckets
CREATE POLICY "clinic_covers_select" ON storage.objects FOR SELECT USING (bucket_id = 'clinic-covers');
CREATE POLICY "clinic_covers_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'clinic-covers' AND auth.role() = 'authenticated'
);

CREATE POLICY "prescriptions_select" ON storage.objects FOR SELECT USING (
  bucket_id = 'prescriptions' AND auth.role() = 'authenticated'
);
CREATE POLICY "prescriptions_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'prescriptions' AND auth.role() = 'authenticated'
);

CREATE POLICY "nfe_xml_select" ON storage.objects FOR SELECT USING (
  bucket_id = 'nfe-xml' AND auth.role() = 'authenticated'
);
CREATE POLICY "nfe_xml_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'nfe-xml' AND auth.role() = 'authenticated'
);
