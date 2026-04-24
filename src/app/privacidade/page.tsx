import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade — NaviClin",
  description: "Entenda como o NaviClin coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
}

const sections = [
  {
    id: "quem-somos",
    title: "1. Quem somos",
    content: "NaviClin Tecnologia Ltda, CNPJ 00.000.000/0001-00, com sede em Rio de Janeiro/RJ, é a controladora dos dados pessoais tratados pela plataforma NaviClin.",
  },
  {
    id: "dados-coletados",
    title: "2. Dados que coletamos",
    content: "Coletamos dados fornecidos diretamente por você (nome, email, CPF, CNPJ CRM, CRO, data de nascimento, telefone, dados de saúde), dados gerados pelo uso da plataforma (logs de acesso, preferências, agenda), e dados de pagamento processados de forma segura pelo Mercado Pago. Dados de saúde (prontuário, anamnese, evoluções clínicas) são tratados com base legal específica e com controles de segurança reforçados.",
  },
  {
    id: "finalidades",
    title: "3. Para que usamos seus dados",
    content: "Seus dados são utilizados para: (a) prestação dos serviços contratados; (b) comunicações essenciais sobre a conta; (c) melhoria e personalização da plataforma; (d) conformidade legal e regulatória; (e) prevenção de fraudes. Não vendemos dados pessoais a terceiros.",
  },
  {
    id: "base-legal",
    title: "4. Base legal (LGPD)",
    content: "O tratamento é realizado com base nas seguintes hipóteses legais: cumprimento de contrato (Art. 7°, V); legítimo interesse (Art. 7°, IX); cumprimento de obrigação legal (Art. 7°, II); e para dados de saúde, com consentimento específico do titular (Art. 11, I) ou para tutela da saúde (Art. 11, II, f).",
  },
  {
    id: "compartilhamento",
    title: "5. Compartilhamento de dados",
    content: "Compartilhamos dados somente com: parceiros técnicos necessários para operação (Supabase para banco de dados, Mercado Pago para pagamentos, Resend para e-mails), todos com contratos de processamento adequados. Não compartilhamos dados com anunciantes ou para fins de marketing por terceiros.",
  },
  {
    id: "seguranca",
    title: "6. Segurança",
    content: "Adotamos medidas técnicas e organizacionais para proteger seus dados: criptografia AES-256 em repouso e TLS 1.3 em trânsito, controle de acesso baseado em função (RBAC), logs de auditoria, backups diários criptografados e testes de segurança periódicos.",
  },
  {
    id: "retencao",
    title: "7. Retenção de dados",
    content: "Mantemos seus dados pelo período necessário para a prestação dos serviços e cumprimento de obrigações legais. Prontuários eletrônicos são retidos por mínimo 5 anos conforme Resolução CFM. Após cancelamento da conta, você pode solicitar a exclusão dos dados não sujeitos a obrigação legal.",
  },
  {
    id: "seus-direitos",
    title: "8. Seus direitos (LGPD)",
    content: "Você tem direito a: confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento, revogação de consentimento e petição à ANPD. Para exercer seus direitos, acesse Configurações > Segurança.",
  },
  {
    id: "cookies",
    title: "9. Cookies",
    content: "Utilizamos cookies estritamente necessários para funcionamento da plataforma (sessão, autenticação) e cookies analíticos opcionais para melhoria do produto. Você pode gerenciar suas preferências de cookies nas configurações do navegador.",
  },
  {
    id: "alteracoes",
    title: "10. Alterações nesta política",
    content: "Esta política pode ser atualizada. Mudanças relevantes serão comunicadas por email. A versão mais recente estará sempre disponível em naviclin.com/privacidade.",
  },
  {
    id: "contato",
    title: "11. Contato e DPO",
    content: "Dúvidas sobre privacidade? Nos contate pela nossa página de contato em naviclin.com.br/contato — respondemos em até 72 horas úteis.",
  },
]

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 flex gap-10">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-3">Nesta página</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="block text-sm text-on-surface-variant hover:text-primary py-1 hover:underline transition-colors">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
          <div className="flex-1 max-w-3xl">
            <div className="mb-8">
              <h1 className="font-headline text-3xl font-bold text-primary mb-2">Política de Privacidade</h1>
              <p className="text-sm text-on-surface-variant">Última atualização: 1 de janeiro de 2025 — em conformidade com a LGPD</p>
            </div>
            <div className="space-y-8">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-lg font-bold text-primary mb-3">{s.title}</h2>
                  <p className="text-on-surface-variant leading-relaxed text-sm">{s.content}</p>
                </section>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-outline-variant">
              <p className="text-xs text-outline">NaviClin Tecnologia Ltda — CNPJ 00.000.000/0001-00</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
