-- ===========================================
-- Catálogos globais de sugestão
-- Procedimentos, Insumos e Despesas Fixas
-- ===========================================

CREATE TABLE IF NOT EXISTS catalog_procedures (
  id           SERIAL PRIMARY KEY,
  code         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  category     TEXT,
  specialty    TEXT,
  type         TEXT,
  duration_min INT NOT NULL DEFAULT 30
);

ALTER TABLE catalog_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_procedures_read" ON catalog_procedures
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_catalog_proc_name ON catalog_procedures USING gin(to_tsvector('portuguese', name));
CREATE INDEX IF NOT EXISTS idx_catalog_proc_cat  ON catalog_procedures(category);
CREATE INDEX IF NOT EXISTS idx_catalog_proc_spec ON catalog_procedures(specialty);