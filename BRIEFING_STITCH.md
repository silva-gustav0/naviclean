# Briefing de Design — NaviClin (para Google Stitch)

## Resumo do produto
NaviClin é um SaaS para clínicas odontológicas e médicas brasileiras. Público: donos de clínicas, dentistas/médicos, recepcionistas e pacientes. Tom: profissional, confiável, moderno, com ar premium. Inspiração visual: elegância de apps financeiros + cordialidade de apps de saúde.

## Paleta de cores (ligeiramente mais claras que o pedido original)

### Primárias
- **Azul principal:** `#0D3A6B` (rgb 13, 58, 107) — versão levemente mais clara de #072245. Usar em navbar, botões primários, headings fortes, rodapé.
- **Azul claro (accent/hover):** `#1A5599` — hover de botões primários e links.
- **Azul muito claro (background):** `#E8F0F9` — fundos de seções alternadas, cards informativos.

### Dourado (accent de luxo/CTA secundário)
- **Dourado principal:** `#DBB47A` (rgb 219, 180, 122) — versão levemente mais clara de #d1a35f. Usar em ícones de destaque, badges premium, detalhes de seções hero, bordas sutis.
- **Dourado escuro (hover):** `#C89958` — hover do dourado.
- **Dourado claro (glow):** `#F0D9B0` — backgrounds muito sutis, destaque de feature cards.

### Neutros
- **Branco:** `#FFFFFF` — backgrounds principais.
- **Cinza muito claro:** `#F7F9FC` — backgrounds alternados, inputs.
- **Cinza claro (bordas):** `#E2E8F0`.
- **Cinza texto secundário:** `#64748B`.
- **Cinza texto principal:** `#1E293B`.
- **Preto suave:** `#0F172A` — títulos muito fortes.

### Semânticas
- **Sucesso:** `#10B981` (verde)
- **Aviso:** `#F59E0B` (amarelo/âmbar)
- **Erro:** `#EF4444` (vermelho)
- **Info:** `#3B82F6` (azul info)

### Cores de status de agendamento (específicas do produto)
- Agendado: `#3B82F6` (azul)
- Confirmado: `#10B981` (verde)
- Sala de espera: `#F59E0B` (âmbar)
- Em atendimento: `#8B5CF6` (roxo)
- Aguardando pagamento: `#EC4899` (rosa)
- Concluído: `#6B7280` (cinza)
- Cancelado/Faltou: `#EF4444` (vermelho)

## Tipografia
- **Display/Títulos:** Inter ou Manrope, peso 700-800.
- **Corpo:** Inter, peso 400-500.
- **Números/dados:** Inter tabular.
- Hierarquia sugerida: H1 48-56px, H2 36-40px, H3 24-28px, body 16px, small 14px.

## Estilo visual geral
- Cantos arredondados: 8px (inputs/botões), 12-16px (cards), 24px (seções hero).
- Sombras suaves (0 4px 12px rgba(13,58,107,0.08)).
- Ícones: estilo outline, peso 1.5-2px (ex: Lucide icons).
- Fotografia: profissionais sorrindo em ambiente clínico moderno, pacientes diversos, foco em consultórios limpos e bem iluminados.
- Ilustrações: estilo flat moderno com acentos dourados, evitar stock médico genérico.

---

# LISTA COMPLETA DE PÁGINAS

## BLOCO 1 — SITE PÚBLICO (marketing)

### 1. Landing Page `/`
**Objetivo:** converter donos de clínica em trial/assinantes.
**Seções (ordem):**
1. Navbar sticky: logo NaviClin, links (Recursos, Planos, Blog, Sobre), botões "Entrar" e "Teste grátis".
2. Hero: headline "O software que transforma sua clínica em um negócio de verdade" + subtítulo + CTA dourado "Começar teste grátis por 14 dias" + screenshot do dashboard.
3. Social proof: logos de clínicas clientes + "+500 clínicas usam NaviClin".
4. Módulos (grid de 6 cards): Agenda Inteligente, Prontuário Digital, Odontograma, Financeiro com Split, Portal do Paciente, Estoque com NF-e.
5. Vídeo demonstração (placeholder de vídeo com play dourado).
6. Benefícios em 3 colunas: Mais faturamento, Menos faltas, Equipe organizada.
7. Depoimentos em carrossel: foto, nome, clínica, cidade, texto.
8. Comparativo "NaviClin vs Planilhas vs Softwares antigos" (tabela).
9. Preview dos planos: 3 cards (Solo R$97, Starter R$297, Pro R$597) com destaque no Starter.
10. FAQ (acordeão com 8-10 perguntas).
11. CTA final em banner azul com dourado.
12. Footer completo: colunas de links, redes sociais, newsletter, CNPJ, endereço.

### 2. Recursos `/recursos`
Grid de todos os módulos com explicação longa de cada um (Agenda, Prontuário, Odontograma, Anamnese digital, Receituário, Financeiro, Comissões, Estoque, Portal do Paciente, Marketing, Multi-unidade). Cada card expande para página própria ou seção detalhada com screenshots.

### 3. Planos `/planos`
Tabela comparativa detalhada:
- **Plano Solo** (R$97/mês): 1 profissional, agenda, prontuário básico, 50 pacientes.
- **Plano Clínica Starter** (R$297/mês): até 5 profissionais, módulos completos, 500 pacientes, WhatsApp.
- **Plano Clínica Pro** (R$597/mês): ilimitado, split de comissão, NF-e, portal público, API, suporte prioritário.
Checklist de features, botão CTA em cada coluna, toggle mensal/anual (com 20% off anual).

### 4. Sobre `/sobre`
História, missão, time (fotos dos fundadores), valores, mídia/imprensa.

### 5. Blog — lista `/blog`
Grid de posts com imagem de capa, categoria, título, resumo, data, autor. Filtros por categoria (Gestão, Marketing, Clínico, Financeiro). Barra de busca. Paginação.

### 6. Blog — post individual `/blog/[slug]`
Hero com imagem de capa, título, autor+avatar, tempo de leitura, categoria. Conteúdo rich text com typography confortável (max-width 720px). Sidebar com TOC fixo, posts relacionados. CTA flutuante de assinatura ao final.

### 7. Contato `/contato`
Form (nome, email, WhatsApp, tamanho da clínica, mensagem) + informações de contato + mapa Google + canais (WhatsApp, email, telefone).

### 8. FAQ `/faq`
Perguntas organizadas por categoria (Planos, Migração, Segurança/LGPD, Suporte, Financeiro). Busca.

### 9. Termos de Uso `/termos`
Documento legal em formato de texto longo com âncoras laterais.

### 10. Política de Privacidade `/privacidade`
Mesma estrutura dos termos, foco LGPD.

### 11. LGPD/Segurança `/seguranca`
Página institucional mostrando certificações, criptografia, backups, conformidade LGPD, DPO.

### 12. Página 404
Ilustração amigável, frase "Página não encontrada", botão "Voltar para início".

### 13. Página 500
Similar à 404 mas com mensagem de erro e CTA para contato.

---

## BLOCO 2 — AUTENTICAÇÃO

### 14. Login `/login`
Layout split: esquerda com formulário (email, senha, "lembrar", link "esqueceu senha", botão entrar, divider "ou", botão Google), direita com ilustração/depoimento.

### 15. Cadastro `/cadastro`
Similar ao login mas com campos (nome completo, email, WhatsApp, senha, confirmar senha, checkbox termos). Após cadastro → onboarding.

### 16. Esqueci minha senha `/esqueci-senha`
Form simples com email + botão "Enviar link".

### 17. Redefinir senha `/redefinir-senha`
Form com nova senha + confirmar.

### 18. Verificar email `/verificar-email`
Tela informativa com ícone de email, instrução de verificar caixa, botão "Reenviar".

---

## BLOCO 3 — ONBOARDING (pós cadastro)

### 19. Onboarding `/onboarding`
Wizard de 4 passos com progress bar dourada:
1. Dados da clínica (nome, CNPJ, especialidade, tamanho).
2. Escolha do slug público (preview "naviclin.com/c/[slug]").
3. Horários de atendimento.
4. Convite da equipe (opcional) ou pular.
Após finalizar → `/dashboard`.

---

## BLOCO 4 — DASHBOARD INTERNO (usuários logados)

**Layout base:** Sidebar esquerda fixa (logo no topo, navegação principal, avatar+menu do usuário no fim), topbar com busca global, notificações, seletor de unidade (se multi-unidade), conteúdo principal.

### 20. Dashboard principal `/dashboard`
Cards de KPIs (agendamentos hoje, faturamento do mês, pacientes ativos, taxa de no-show). Gráfico de faturamento últimos 6 meses. Lista de próximos agendamentos. Alertas (estoque baixo, aniversariantes, pagamentos atrasados). Atalhos rápidos.

### 21. Agenda — visão calendário `/agenda`
Views toggle: dia, semana, mês. Coluna por profissional (multi-coluna). Blocos coloridos por status. Drag & drop. Sidebar direita com filtros (profissional, sala, status). Botão flutuante dourado "+ Novo agendamento".

### 22. Agenda — novo agendamento (modal ou `/agenda/novo`)
Formulário: paciente (busca ou cadastro rápido), profissional, data, horário, duração, procedimentos, observações. Preview do valor.

### 23. Agenda — detalhe do agendamento `/agenda/[id]`
Info completa, timeline de eventos (criado, confirmado, check-in, iniciado, finalizado), botões de ação contextual (confirmar, chamar, iniciar, finalizar, faturar).

### 24. Sala de Espera `/agenda/sala-de-espera`
Lista em tempo real (Realtime) de pacientes aguardando. Cards com foto, nome, horário, tempo de espera (cronômetro), profissional, ações (chamar, pular). Cores por status.

### 25. Pacientes — lista `/pacientes`
Tabela com foto, nome, CPF, telefone, último atendimento, próximo agendamento, status. Filtros (ativo/inativo, convênio, profissional responsável). Busca. Botão "+ Novo paciente".

### 26. Pacientes — novo/editar `/pacientes/novo` e `/pacientes/[id]/editar`
Form multi-seção: dados pessoais, endereço, contatos de emergência, convênio, foto.

### 27. Pacientes — prontuário `/pacientes/[id]`
**Página crucial.** Header com foto, nome, idade, convênio, tags (alergias, condições). Tabs:
1. **Resumo:** info pessoal, histórico resumido, próximos agendamentos, saldo financeiro.
2. **Anamnese:** formulário estruturado (condições, medicações, alergias, histórico familiar), botão "Enviar link para paciente preencher" (gera token).
3. **Odontograma:** SVG interativo FDI (arcada adulta 18-11/21-28 e 48-41/31-38), cada dente com 5 faces clicáveis, legenda de símbolos (cárie, restauração, extraído, coroa, implante). Histórico por dente.
4. **Evoluções clínicas:** timeline de atendimentos, cada um com procedimentos, observações, anexos, botão "Assinar" (bloqueia edição após assinar via hash SHA-256). Filtro por profissional/data.
5. **Planos de tratamento:** lista de planos, cada um com procedimentos, valores, forma de pagamento, status (orçado, aprovado, em andamento, concluído).
6. **Receituário:** histórico de receitas em PDF, botão "Nova receita" (gera PDF via pdf-lib com assinatura digital).
7. **Arquivos:** grid de exames/fotos/documentos, upload drag-drop.
8. **Financeiro:** lançamentos, parcelas, pagamentos do paciente.

### 28. Tratamentos/Serviços — lista `/tratamentos`
Tabela de procedimentos, categoria, duração, preço base. Botão "+ Novo serviço".

### 29. Tratamentos — novo/editar `/tratamentos/novo` e `/tratamentos/[id]/editar`
Form com nome, código TUSS, categoria, duração, custos diretos, preços por tabela (convênio/particular), regras de comissão.

### 30. Planos de tratamento — lista `/tratamentos/planos`
Lista de planos em andamento, filtros por status e profissional.

### 31. Planos de tratamento — detalhe `/tratamentos/planos/[id]`
Lista de procedimentos, status de cada, timeline, anexos, botões de ação (aprovar, imprimir, enviar por WhatsApp).

### 32. Financeiro — dashboard `/financeiro`
KPIs (entradas do mês, saídas, lucro líquido, contas a receber, contas a pagar, inadimplência). Gráficos. Top procedimentos. Top profissionais.

### 33. Financeiro — lançamentos `/financeiro/lancamentos`
Tabela de transações (entradas e saídas), filtros por período, tipo, status, profissional, paciente. Export para Excel/PDF.

### 34. Financeiro — novo lançamento `/financeiro/lancamentos/novo`
Form: tipo (receita/despesa), categoria, valor, data, forma de pagamento, parcelas, paciente, procedimento.

### 35. Financeiro — comissões `/financeiro/comissoes`
Por profissional: procedimentos realizados, valor bruto, custos diretos, valor líquido, comissão calculada, status (pendente/liberada/paga). Botão "Fechar mês" gera relatório.

### 36. Financeiro — convênios `/financeiro/convenios`
Lista de convênios cadastrados, tabelas de preço vinculadas, repasse esperado, pacientes ativos.

### 37. Financeiro — tabelas de preço `/financeiro/tabelas-preco`
Lista de tabelas (Particular, Amil, SulAmérica, etc). Edição: procedimento x preço.

### 38. Financeiro — relatórios `/financeiro/relatorios`
Relatórios prontos (DRE, fluxo de caixa, faturamento por profissional, por convênio, inadimplência). Configuração de período.

### 39. Estoque — lista `/estoque`
Tabela de itens: nome, categoria, estoque atual, mínimo, validade mais próxima, fornecedor. Alertas em vermelho para estoque baixo/vencimento próximo.

### 40. Estoque — item detalhe `/estoque/[id]`
Info do item, lotes ativos (com validade FEFO), histórico de movimentações, consumo médio mensal.

### 41. Estoque — novo item `/estoque/novo`
Form: nome, categoria, unidade, estoque mínimo, fornecedor, custo médio.

### 42. Estoque — movimentações `/estoque/movimentacoes`
Tabela de entradas/saídas/ajustes/perdas. Filtros.

### 43. Estoque — nova movimentação `/estoque/movimentacoes/nova`
Form contextual (entrada de compra, saída manual, ajuste de inventário, perda por vencimento).

### 44. Estoque — importar NF-e `/estoque/importar-nfe`
Upload de XML de NF-e, preview dos itens detectados, mapeamento para itens existentes ou criar novos, confirmação.

### 45. Equipe — lista `/equipe`
Cards de membros: foto, nome, função, especialidade, status (ativo/férias/bloqueado), último login. Filtros por função.

### 46. Equipe — membro detalhe `/equipe/[id]`
Perfil completo, produtividade (atendimentos mês), comissão do mês, agenda, permissões.

### 47. Equipe — convidar `/equipe/convidar`
Form: email, função, permissões, especialidade. Envia email de convite.

### 48. Equipe — permissões `/equipe/permissoes`
Matriz de permissões por função (super_admin, owner, dentista filiado, dentista independente, recepcionista, paciente). Editável pelo owner.

### 49. Marketing — dashboard `/marketing`
KPIs de aquisição (novos pacientes, origem, conversão, avaliações). Gráfico de leads do site.

### 50. Marketing — campanhas `/marketing/campanhas`
Lista de campanhas (WhatsApp, email, SMS). Status, alcance, conversão.

### 51. Marketing — nova campanha `/marketing/campanhas/nova`
Wizard: selecionar segmento de pacientes, escolher canal, template de mensagem, agendamento.

### 52. Marketing — blog (admin) `/marketing/blog`
Lista de posts do blog público, status (rascunho/publicado), views, botão "+ Novo post".

### 53. Marketing — editor de post `/marketing/blog/[id]/editar`
Editor rich text, upload de capa, SEO (meta title, meta description, slug), categorias, tags, autor, agendamento.

### 54. Marketing — avaliações `/marketing/avaliacoes`
Reviews recebidas do portal público. Responder, destacar, moderar.

### 55. Marketing — leads `/marketing/leads`
Leads capturados via site público. Status (novo, contatado, convertido, perdido), atribuição a profissional.

### 56. Configurações — overview `/configuracoes`
Menu lateral de seções (clínica, horários, assinatura, integrações, notificações, perfil, segurança).

### 57. Configurações — clínica `/configuracoes/clinica`
Form de dados da clínica (nome, CNPJ, logo, endereço, especialidades, slug público, fotos).

### 58. Configurações — horários `/configuracoes/horarios`
Grade semanal de horários de atendimento, pausas, feriados.

### 59. Configurações — assinatura `/configuracoes/assinatura`
Plano atual, limite de uso (profissionais, pacientes, armazenamento), próxima cobrança, histórico de pagamentos, botão "Mudar plano", botão "Portal de cobrança" (Stripe Customer Portal).

### 60. Configurações — integrações `/configuracoes/integracoes`
Cards de integrações: WhatsApp Business, Stripe, Google Calendar, Google Maps, Resend. Cada uma com status, botão configurar.

### 61. Configurações — notificações `/configuracoes/notificacoes`
Toggle por tipo de notificação (confirmação, lembrete, aniversário, pós-atendimento). Por canal (email, WhatsApp, SMS). Templates editáveis.

### 62. Configurações — perfil `/configuracoes/perfil`
Dados pessoais, foto, senha, 2FA.

### 63. Configurações — segurança `/configuracoes/seguranca`
Sessões ativas, log de acessos, logs de auditoria LGPD, exportar dados, excluir conta.

---

## BLOCO 5 — PORTAL PÚBLICO DO PACIENTE

### 64. Busca de clínicas `/buscar`
Input de busca com geolocalização, filtros (especialidade, convênio, raio em km), lista+mapa lado a lado. Cards de clínica com foto, nome, distância, nota, botão "Agendar".

### 65. Perfil público da clínica `/c/[slug]`
Landing pública da clínica:
- Hero com foto/capa, nome, especialidades, endereço, mapa, horários.
- Sobre a clínica.
- Profissionais (grid de cards).
- Serviços oferecidos.
- Avaliações.
- Galeria de fotos.
- Botão fixo "Agendar horário" (dourado).
- Blog da clínica (opcional).
- Contato + WhatsApp.

### 66. Perfil público do profissional `/p/[slug]`
Página pessoal do dentista/médico:
- Foto, nome, especialidade, CRO/CRM.
- Clínica(s) onde atende.
- Formação.
- Procedimentos que faz.
- Avaliações.
- Agenda pública com horários disponíveis.
- Botão "Agendar com este profissional".

### 67. Agendamento público — seleção de horário `/c/[slug]/agendar`
Wizard:
1. Escolher procedimento/especialidade.
2. Escolher profissional (ou "qualquer").
3. Escolher data e horário (calendário com slots disponíveis).
4. Dados do paciente (nome, CPF, email, WhatsApp).
5. Confirmar (hold de 10 min).
6. Sucesso com instruções.

### 68. Login do paciente `/paciente/login`
Form simples (email/CPF + senha ou código por WhatsApp).

### 69. Portal do paciente — dashboard `/paciente`
Cards: próximo agendamento, receitas ativas, saldo, avaliações pendentes.

### 70. Portal do paciente — agendamentos `/paciente/agendamentos`
Lista futuros e passados, botão reagendar/cancelar, check-in online.

### 71. Portal do paciente — receitas `/paciente/receitas`
Lista de receitas em PDF, download, validade.

### 72. Portal do paciente — anamnese `/paciente/anamnese/[token]`
Acesso via token (enviado pela clínica): formulário estruturado multi-etapas, auto-save, submit final.

### 73. Portal do paciente — financeiro `/paciente/financeiro`
Parcelas, pagamentos, boletos/PIX/cartão. Botão "Pagar agora".

### 74. Portal do paciente — avaliar `/paciente/avaliar/[appointmentId]`
Formulário de review (estrelas por categoria: atendimento, limpeza, pontualidade, tratamento) + texto.

---

## BLOCO 6 — ÁREA ADMIN (super_admin NaviClin)

### 75. Admin dashboard `/admin`
KPIs globais: clínicas ativas, MRR, churn, novos trials, tickets de suporte.

### 76. Admin — clínicas `/admin/clinicas`
Tabela de todas clínicas, plano, status, MRR, ações (suspender, impersonar).

### 77. Admin — usuários `/admin/usuarios`
Todos usuários do sistema. Busca, filtros, reset senha.

### 78. Admin — planos `/admin/planos`
CRUD dos planos disponíveis (preço, limites, features).

### 79. Admin — blog global `/admin/blog`
Blog NaviClin institucional (diferente do blog de cada clínica).

### 80. Admin — cupons `/admin/cupons`
Gestão de cupons promocionais Stripe.

### 81. Admin — logs `/admin/logs`
Logs técnicos e auditoria do sistema.

---

## COMPONENTES RECORRENTES (para Stitch reaproveitar)

- **Navbar dashboard:** sidebar 240px, itens com ícone + label, indicador azul quando ativo, divisor dourado no topo.
- **Card de KPI:** label pequena cinza, número grande azul, variação % colorida (verde/vermelho), ícone dourado no canto.
- **Botão primário:** fundo azul `#0D3A6B`, texto branco, hover azul claro.
- **Botão secundário:** borda azul, texto azul, hover preenchido.
- **Botão dourado (CTA):** fundo `#DBB47A`, texto azul escuro, hover dourado escuro.
- **Input:** borda cinza clara, foco borda azul com glow sutil, label acima.
- **Tabela:** header cinza claro, linhas alternadas, hover azul muito claro, ações no hover (ícones à direita).
- **Modal:** overlay preto 50%, card branco centralizado, max-width 560px, cantos 16px.
- **Toast:** canto superior direito, 4 variantes (sucesso verde, erro vermelho, info azul, aviso âmbar).
- **Badge de status:** pílula pequena colorida conforme tabela de status.
- **Avatar:** circular, fallback com iniciais em azul claro.
- **Empty state:** ilustração + texto + CTA dourado.
- **Skeleton loader:** blocos cinza claro com shimmer.

---

## INSTRUÇÕES FINAIS PARA O STITCH

1. Gerar todas as páginas listadas acima com a paleta definida.
2. Priorizar consistência entre páginas: mesmos componentes, mesmos espaçamentos (sistema 4px/8px/16px/24px/32px/48px/64px).
3. Mobile-first: todas as páginas devem ter versão mobile responsiva.
4. Acessibilidade: contraste AA mínimo, focus visível dourado, labels em todos inputs.
5. Idioma: português brasileiro em todos os textos.
6. Estilo premium mas não frio — transmitir confiança + cuidado humano.
