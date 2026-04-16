import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"
import { Shield, Lock, Database, RefreshCw, Eye, FileCheck, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Segurança e LGPD — NaviClin",
  description: "Saiba como o NaviClin protege os dados da sua clínica: criptografia, backups, certificações e conformidade com a LGPD.",
}

const pillars = [
  {
    icon: Lock,
    title: "Criptografia de ponta a ponta",
    desc: "AES-256 em repouso e TLS 1.3 em trânsito. Todos os dados sensíveis — incluindo prontuários — são criptografados antes de serem armazenados.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Database,
    title: "Backups automáticos",
    desc: "Backups diários criptografados com retenção de 30 dias. Infraestrutura redundante em múltiplas zonas de disponibilidade.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Eye,
    title: "Controle de acesso (RBAC)",
    desc: "Cada membro da equipe acessa apenas o que precisa. Logs de auditoria registram toda ação sensível na plataforma.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: RefreshCw,
    title: "Disponibilidade 99.9%",
    desc: "SLA garantido de 99.9% de uptime. Monitoramento 24/7 com alertas automáticos para qualquer anomalia.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shield,
    title: "Conformidade LGPD",
    desc: "Adequação total à Lei nº 13.709/2018. DPO designado, contratos de processamento com fornecedores e mecanismos de direitos dos titulares.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: FileCheck,
    title: "Pentest e auditoria",
    desc: "Testes de penetração semestrais por empresa independente. Resultados e remediações documentados e disponíveis para clientes no plano Pro.",
    color: "bg-cyan-50 text-cyan-600",
  },
]

const lgpdRights = [
  "Confirmação da existência de tratamento",
  "Acesso aos dados",
  "Correção de dados incompletos ou desatualizados",
  "Anonimização ou bloqueio de dados desnecessários",
  "Portabilidade dos dados",
  "Eliminação dos dados pessoais",
  "Informação sobre compartilhamento",
  "Revogação do consentimento",
]

export default function SegurancaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Shield className="h-4 w-4" />
            Infraestrutura segura
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Dados de saúde exigem<br />o máximo de proteção
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            No NaviClin, segurança e privacidade não são opcionais. São parte central da arquitetura.
          </p>
        </section>

        {/* Pillars */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="border rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center mb-4`}>
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LGPD */}
        <section className="py-16 px-6 bg-[#F7F9FC]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-[#0D3A6B]/10 text-[#0D3A6B] text-sm font-semibold px-3 py-1 rounded-full mb-4">LGPD</span>
                <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Conformidade total com a Lei Geral de Proteção de Dados</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  O NaviClin foi projetado desde o início com privacy by design. Temos DPO designado, registro de operações de tratamento e processos documentados para atender os direitos dos titulares.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Exportação e exclusão de dados disponíveis diretamente no painel do paciente e da clínica — sem necessidade de contatar suporte.
                </p>
              </div>
              <div className="bg-white border rounded-2xl p-6">
                <p className="font-semibold text-sm mb-4">Direitos que garantimos</p>
                <ul className="space-y-2.5">
                  {lgpdRights.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DPO Contact */}
        <section className="py-12 px-6 border-t">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Fale com nosso DPO</h2>
            <p className="text-slate-500 text-sm mb-4">Dúvidas sobre privacidade e proteção de dados? Respondemos em até 72 horas úteis.</p>
            <a
              href="mailto:dpo@naviclin.com"
              className="inline-flex items-center gap-2 border border-[#0D3A6B] text-[#0D3A6B] font-semibold px-6 py-3 rounded-xl hover:bg-[#0D3A6B] hover:text-white transition-colors text-sm"
            >
              dpo@naviclin.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
