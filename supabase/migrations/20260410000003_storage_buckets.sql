-- ===========================================
-- STORAGE BUCKETS
-- ===========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
    ('clinic-logos', 'clinic-logos', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/svg+xml']),
    ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
    ('patient-files', 'patient-files', false, 20971520, ARRAY['image/jpeg','image/png','image/webp','application/pdf','image/dicom']),
    ('treatment-images', 'treatment-images', false, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- STORAGE RLS POLICIES
-- ===========================================

-- avatars: qualquer usuario autenticado pode fazer upload do proprio avatar
CREATE POLICY "avatars_select" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "avatars_update" ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "avatars_delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- clinic-logos: publico para leitura, owner para escrita
CREATE POLICY "clinic_logos_select" ON storage.objects FOR SELECT USING (bucket_id = 'clinic-logos');
CREATE POLICY "clinic_logos_insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'clinic-logos' AND auth.role() = 'authenticated'
);
CREATE POLICY "clinic_logos_update" ON storage.objects FOR UPDATE USING (
    bucket_id = 'clinic-logos' AND auth.role() = 'authenticated'
);
CREATE POLICY "clinic_logos_delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'clinic-logos' AND auth.role() = 'authenticated'
);

-- blog-images: publico para leitura, autenticado para escrita
CREATE POLICY "blog_images_select" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "blog_images_insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'blog-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "blog_images_update" ON storage.objects FOR UPDATE USING (
    bucket_id = 'blog-images' AND auth.role() = 'authenticated'
);

-- patient-files: privado, somente membros autenticados
CREATE POLICY "patient_files_select" ON storage.objects FOR SELECT USING (
    bucket_id = 'patient-files' AND auth.role() = 'authenticated'
);
CREATE POLICY "patient_files_insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'patient-files' AND auth.role() = 'authenticated'
);
CREATE POLICY "patient_files_delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'patient-files' AND auth.role() = 'authenticated'
);

-- treatment-images: privado, somente membros autenticados
CREATE POLICY "treatment_images_select" ON storage.objects FOR SELECT USING (
    bucket_id = 'treatment-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "treatment_images_insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'treatment-images' AND auth.role() = 'authenticated'
);
