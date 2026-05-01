CREATE TABLE IF NOT EXISTS catalog_fixed_expenses (
  id              SERIAL PRIMARY KEY,
  code            TEXT NOT NULL UNIQUE,
  category        TEXT,
  description     TEXT NOT NULL,
  type            TEXT,
  periodicity     TEXT,
  estimated_value DECIMAL(10,2),
  recipient       TEXT
);

ALTER TABLE catalog_fixed_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_expenses_read" ON catalog_fixed_expenses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_catalog_exp_name ON catalog_fixed_expenses USING gin(to_tsvector('portuguese', description));
CREATE INDEX IF NOT EXISTS idx_catalog_exp_cat  ON catalog_fixed_expenses(category);

INSERT INTO catalog_fixed_expenses (code, category, description, type, periodicity, estimated_value, recipient) VALUES
  ('INF-001', 'Infraestrutura Clínica', 'Aluguel do Consultório / Clínica', 'Fixo', 'Mensal', 5500, 'Imobiliária'),
  ('INF-002', 'Infraestrutura Clínica', 'Condomínio Comercial', 'Fixo', 'Mensal', 900, 'Administradora'),
  ('INF-003', 'Infraestrutura Clínica', 'IPTU', 'Fixo', 'Mensal', 350, 'Prefeitura'),
  ('INF-004', 'Infraestrutura Clínica', 'Energia Elétrica (Alto consumo por autoclaves/ar condicionado)', 'Híbrido', 'Mensal', 1400, 'Concessionária'),
  ('INF-005', 'Infraestrutura Clínica', 'Água e Esgoto (Taxa comercial)', 'Híbrido', 'Mensal', 300, 'Concessionária'),
  ('INF-006', 'Infraestrutura Clínica', 'Internet Fibra Ótica (Alta estabilidade para Telemedicina)', 'Fixo', 'Mensal', 200, 'Provedor'),
  ('INF-007', 'Infraestrutura Clínica', 'Plano de Celular/WhatsApp Business da Recepção', 'Fixo', 'Mensal', 120, 'Operadora'),
  ('BIO-001', 'Biossegurança e Resíduos', 'PGRSS - Coleta de Lixo Infectante e Perfurocortante', 'Fixo', 'Mensal', 250, 'Empresa de Coleta Especializada'),
  ('BIO-002', 'Biossegurança e Resíduos', 'Dosimetria Pessoal (Monitoramento de Radiação de Raio-X)', 'Fixo', 'Mensal', 150, 'Laboratório de Dosimetria'),
  ('BIO-003', 'Biossegurança e Resíduos', 'Manutenção Preventiva de Equipamentos (Autoclave, Compressor, Cadeira)', 'Fixo', 'Mensal', 400, 'Técnico Especializado'),
  ('BIO-004', 'Biossegurança e Resíduos', 'Controle de Pragas e Dedetização', 'Fixo', 'Trimestral (Rateio Mensal)', 50, 'Dedetizadora'),
  ('TEC-001', 'Tecnologia', 'NaviClin - Plataforma de Gestão e Prontuário Eletrônico', 'Fixo', 'Mensal', 299.9, 'NaviClin'),
  ('TEC-002', 'Tecnologia', 'Sistema PACS/DICOM (Armazenamento de Imagens Radiológicas)', 'Fixo', 'Mensal', 350, 'Provedor Cloud Saúde'),
  ('TEC-003', 'Tecnologia', 'Certificado Digital A1/A3 (Para assinatura de receitas e PEP)', 'Fixo', 'Anual (Rateio Mensal)', 30, 'Certificadora'),
  ('TEC-004', 'Tecnologia', 'Hospedagem de Site e E-mail Corporativo (@naviclin.com)', 'Fixo', 'Mensal', 80, 'Servidor Cloud'),
  ('RH-001', 'Folha de Pagamento', 'Salário: Recepcionista / Secretária Clínica', 'Fixo', 'Mensal', 2200, 'Colaborador'),
  ('RH-002', 'Folha de Pagamento', 'Salário: ASB (Aux. Saúde Bucal) / Técnico de Enfermagem', 'Fixo', 'Mensal', 2500, 'Colaborador'),
  ('RH-003', 'Folha de Pagamento', 'Adicional de Insalubridade (20% sobre Salário Mínimo - ASB/Enfermagem)', 'Fixo', 'Mensal', 282.4, 'Colaborador'),
  ('RH-004', 'Folha de Pagamento', 'Encargos Sociais (INSS, FGTS, etc.)', 'Fixo', 'Mensal', 3200, 'Governo'),
  ('RH-005', 'Folha de Pagamento', 'Provisão de Férias e 13º Salário', 'Fixo', 'Mensal', 700, 'Caixa Clínica'),
  ('RH-006', 'Folha de Pagamento', 'Vale Transporte e Vale Alimentação', 'Fixo', 'Mensal', 1400, 'Operadora de Benefícios'),
  ('RH-007', 'Folha de Pagamento', 'Pró-Labore (Remuneração Fixa dos Sócios/Diretoria)', 'Fixo', 'Mensal', 8000, 'Sócios'),
  ('RH-008', 'Folha de Pagamento', 'Responsabilidade Técnica (RT) - Caso contratado', 'Fixo', 'Mensal', 1500, 'Médico/Dentista RT'),
  ('ADM-001', 'Administrativo e Jurídico', 'Honorários Contábeis (Contabilidade Especializada em Saúde)', 'Fixo', 'Mensal', 1000, 'Escritório de Contabilidade'),
  ('ADM-002', 'Administrativo e Jurídico', 'Seguro de Responsabilidade Civil Profissional (Erro Médico/Odonto)', 'Fixo', 'Mensal', 300, 'Corretora de Seguros'),
  ('ADM-003', 'Administrativo e Jurídico', 'Assessoria de Marketing Médico / Gestão de Tráfego', 'Fixo', 'Mensal', 2000, 'Agência / Freelancer'),
  ('ADM-004', 'Administrativo e Jurídico', 'Faxina / Serviço de Limpeza Hospitalar', 'Fixo', 'Mensal', 1200, 'Terceirizada / Diarista'),
  ('ADM-005', 'Administrativo e Jurídico', 'Segurança Eletrônica (Alarme e Câmeras)', 'Fixo', 'Mensal', 180, 'Empresa de Segurança'),
  ('TAX-001', 'Taxas e Legalização', 'Alvará da Vigilância Sanitária (Provisão Mensal)', 'Fixo', 'Anual (Rateio)', 100, 'Vigilância Sanitária'),
  ('TAX-002', 'Taxas e Legalização', 'Taxa do CNES (Cadastro Nacional de Estabelecimentos de Saúde)', 'Fixo', 'Anual (Rateio)', 50, 'Ministério da Saúde'),
  ('TAX-003', 'Taxas e Legalização', 'Anuidade CRM / CRO da Pessoa Jurídica (Clínica)', 'Fixo', 'Anual (Rateio)', 150, 'Conselho Regional'),
  ('TAX-004', 'Taxas e Legalização', 'Alvará de Funcionamento e Localização da Prefeitura', 'Fixo', 'Anual (Rateio)', 80, 'Prefeitura'),
  ('SUP-001', 'Suprimentos Administrativos', 'Cota - Material de Escritório (Papel A4, Toner para Receitas)', 'Fixo', 'Mensal', 250, 'Papelaria'),
  ('SUP-002', 'Suprimentos Administrativos', 'Cota - Copa e Recepção (Café expresso, água, biscoitos para pacientes)', 'Fixo', 'Mensal', 450, 'Supermercado'),
  ('SUP-003', 'Suprimentos Administrativos', 'Cota - Material de Limpeza Geral', 'Fixo', 'Mensal', 300, 'Distribuidora');
