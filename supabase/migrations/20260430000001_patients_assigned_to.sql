-- Add assigned_to column to patients for professional assignment feature
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.clinic_members(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_patients_assigned_to ON public.patients(assigned_to);
