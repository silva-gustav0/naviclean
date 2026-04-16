import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"
import {
  Calendar, FileText, ClipboardList, DollarSign, Users, Package,
  Globe, MessageSquare, BarChart3, Shield, Smartphone, Zap,
  ChevronRight, Check,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Recursos — NaviClin",
  description: "Conheça todos os módulos e funcionalidades do NaviClin: agenda, prontuário, odontograma, financeiro, estoque e muito mais.",
}

const modules = [
  {
    icon: Calendar,
    color: "bg-blue-50 text-blue-600",
    title: "Agenda Inteligente",
    description: "Visualização em dia, semana e mês com múltiplas colunas por profissional. Drag & drop, bloqueio de horários, confirmação automática por WhatsApp.",
    features: ["Views: dia, semana e mês", "Multi-profissional", "Confirmação automática", "Sala de espera em tempo real", "Agendamento pelo paciente"],
  },
  {
    icon: FileText,
    color: "bg-violet-50 text-violet-600",
    title: "Prontuário Digital",
    description: "Registro completo do histórico clínico com evoluções assinadas digitalmente, planos de tratamento e receituário em PDF.",
    features: ["Evoluções com assinatura digital", "Planos de tratamento", "Receituário em PDF", "Histórico de procedimentos", "Anexos e exames"],
  },
  {
    icon: ClipboardList,
    color: "bg-cyan-50 text-cyan-600",
    title: "Odontograma Interativo",
    description: "SVG FDI completo com arcada adulta e infantil. Clique em cada face do dente para registrar procedimentos, cáries e tratamentos.",
    features: ["Padrão FDI internacional", "Arcada adulta e infantil", "5 faces por dente", "Histórico por elemento", "Legenda de símbolos"],
  },
  {
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600",
    title: "Financeiro Completo",
    description: "Controle de receitas, despesas, comissões e convênios. Relatórios em DRE, fluxo de caixa e faturamento por profissional.",
    features: ["Receitas e despesas", "Comissões automáticas", "Gestão de convênios", "DRE e fluxo de caixa", "Export Excel/PDF"],
  },
  {
    icon: Users,
    color: "bg-orange-50 text-orange-600",
    title: "Gestão de Pacientes",
    description: "Cadastro completo com anamnese digital, histórico de atendimentos, avaliações e portal exclusivo para o paciente.",
    features: ["Anamnese digital", "Portal do paciente", "Histórico completo", "Avaliações e feedback", "Agendamento self-service"],
  },
  {
    icon: Package,
    color: "bg-amber-50 text-amber-600",
    title: "Estoque com NF-e",
    description: "Controle de inventário com lotes, validade FEFO, alertas automáticos e importação de NF-e para entrada automática de produtos.",
    features: ["Controle de lotes", "Validade FEFO", "Alertas automáticos", "Importação de NF-e", "Movimentações"],
  },
  {
    icon: Globe,
    color: "bg-sky-50 text-sky-600",
    title: "Portal Público",
    description: "Página da sua clínica com perfil de profissionais, serviços, avaliações e botão de agendamento online 24/7.",
    features: ["Página da clínica", "Perfil de profissionais", "Avaliações públicas", "Agendamento online", "SEO otimizado"],
  },
  {
    icon: MessageSquare,
    color: "bg-green-50 text-green-600",
    title: "Marketing e Comunicação",
    description: "Lembretes automáticos por WhatsApp e email, campanhas de reativação, blog da clínica e gestão de leads.",
    features: ["Lembretes automáticos", "Campanhas WhatsApp", "Blog da clínica", "Gestão de leads", "Avaliações pós-consulta"],
  },
  {
    icon: BarChart3,
    color: "bg-rose-50 text-rose-600",
    title: "Relatórios e BI",
    description: "Dashboards executivos com KPIs de agendamentos, faturamento, taxa de no-show, produtividade por profissional e muito mais.",
    features: ["KPIs em tempo real", "Taxa de no-show", "Produtividade", "Faturamento por procedimento", "Tendências mensais"],
  },
  {
    icon: Shield,
    color: "bg-slate-50 text-slate-600",
    title: "Segurança e LGPD",
    description: "Dados criptografados, backups automáticos, logs de auditoria, DPO incluído e conformidade total com a LGPD.",
    features: ["Criptografia ponta a ponta", "Backups diários", "Log de auditoria", "Conformidade LGPD", "DPO incluído"],
  },
  {
    icon: Smartphone,
    color: "bg-indigo-50 text-indigo-600",
    title: "Multi-unidade",
    description: "Gerencie várias clínicas em uma única conta. Consolidação de relatórios, equipes separadas e faturamento individual por unidade.",
    features: ["Múltiplas clínicas", "Consolidação de dados", "Equipes separadas", "Relatório consolidado", "Controle de acesso"],
  },
  {
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
    title: "Integrações",
    description: "WhatsApp Business, Stripe para pagamentos, Google Calendar, Resend para emails e API aberta para integrações customizadas.",
    features: ["WhatsApp Business", "Stripe (pagamentos)", "Google Calendar", "Resend (email)", "API REST aberta"],
  },
]

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-[#0D3A6B]/10 text-[#0D3A6B] text-sm font-semibold rounded-full mb-4">
              Plataforma completa
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 leading-tight">
              Tudo que sua clínica precisa<br />em um só lugar
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Mais de 12 módulos integrados para modernizar a gestão da sua clínica odontológica ou médica. Sem planilhas, sem papel, sem complicação.
            </p>
          </div>
        </section>

        {/* Modules grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod) => (
                <div
                  key={mod.title}
                  className="border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:border-[#DBB47A]/30 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${mod.color} flex items-center justify-center mb-4`}>
                    <mod.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{mod.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{mod.description}</p>
                  <ul className="space-y-1.5">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0D3A6B] py-16 px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Pronto para modernizar sua clínica?</h2>
            <p className="text-blue-200 mb-8">Comece o teste grátis de 14 dias. Sem cartão de crédito.</p>
            <a
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-[#DBB47A] hover:bg-[#C89958] text-[#0D3A6B] font-bold px-8 py-4 rounded-xl transition-colors"
            >
              Começar grátis
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
