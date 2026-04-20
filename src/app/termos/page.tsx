import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso — NaviClin",
  description: "Leia os Termos de Uso do NaviClin antes de utilizar a plataforma.",
}

const sections = [
  {
    id: "aceitacao",
    title: "1. Aceitação dos termos",
    content: "Ao acessar ou utilizar a plataforma NaviClin, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não utilize o serviço. Estes termos se aplicam a todos os usuários da plataforma, incluindo proprietários de clínicas, profissionais de saúde, recepcionistas e pacientes.",
  },
  {
    id: "servicos",
    title: "2. Descrição dos serviços",
    content: "O NaviClin é uma plataforma SaaS (Software as a Service) para gestão de clínicas odontológicas e médicas. Os serviços incluem, mas não se limitam a: agendamento online, prontuário digital, controle financeiro, gestão de estoque, portal do paciente e ferramentas de marketing.",
  },
  {
    id: "conta",
    title: "3. Conta do usuário",
    content: "Você é responsável por manter a confidencialidade das suas credenciais de acesso. Você concorda em notificar imediatamente o NaviClin sobre qualquer uso não autorizado da sua conta. O NaviClin não se responsabiliza por perdas decorrentes do uso não autorizado da sua conta.",
  },
  {
    id: "uso",
    title: "4. Uso aceitável",
    content: "Você concorda em utilizar o NaviClin apenas para fins legais e de acordo com estes Termos. É proibido: (a) violar leis aplicáveis; (b) acessar dados de outros usuários sem autorização; (c) transmitir vírus ou código malicioso; (d) tentar reverter a engenharia do software; (e) revender ou sublicenciar o serviço.",
  },
  {
    id: "dados",
    title: "5. Dados e privacidade",
    content: "O tratamento de dados pessoais é regido pela nossa Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Ao utilizar o NaviClin, você autoriza o tratamento dos dados necessários para a prestação dos serviços.",
  },
  {
    id: "pagamento",
    title: "6. Pagamentos e cancelamento",
    content: "Os planos são cobrados mensalmente ou anualmente, conforme selecionado. Não há reembolso de períodos parciais. Você pode cancelar a assinatura a qualquer momento pelo painel de configurações. O cancelamento terá efeito no final do período vigente pago.",
  },
  {
    id: "propriedade",
    title: "7. Propriedade intelectual",
    content: "Todo o conteúdo, software e tecnologia do NaviClin são de propriedade exclusiva da NaviClin Tecnologia Ltda. É vedada a reprodução, distribuição ou criação de obras derivadas sem autorização prévia e expressa.",
  },
  {
    id: "limitacao",
    title: "8. Limitação de responsabilidade",
    content: "O NaviClin é fornecido 'como está'. Em nenhuma hipótese o NaviClin será responsável por danos indiretos, incidentais, especiais ou consequenciais. Nossa responsabilidade total está limitada ao valor pago pelo serviço nos últimos 3 meses.",
  },
  {
    id: "modificacoes",
    title: "9. Modificações dos termos",
    content: "O NaviClin pode modificar estes Termos a qualquer momento. Alterações relevantes serão comunicadas por email com pelo menos 30 dias de antecedência. O uso continuado da plataforma após a vigência das alterações constitui aceitação.",
  },
  {
    id: "foro",
    title: "10. Lei aplicável e foro",
    content: "Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP para dirimir qualquer controvérsia decorrente destes Termos.",
  },
]

export default function TermosPage() {
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
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-on-surface-variant hover:text-primary py-1 hover:underline transition-colors"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 max-w-3xl">
            <div className="mb-8">
              <h1 className="font-headline text-3xl font-bold text-primary mb-2">Termos de Uso</h1>
              <p className="text-sm text-on-surface-variant">Última atualização: 1 de janeiro de 2025</p>
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
              <p className="text-xs text-outline">
                NaviClin Tecnologia Ltda — CNPJ 00.000.000/0001-00 — contato@naviclin.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
