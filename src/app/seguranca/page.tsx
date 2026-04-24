import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Segurança e LGPD — NaviClin",
  description: "Saiba como o NaviClin protege os dados da sua clínica: criptografia, backups, certificações e conformidade com a LGPD.",
}

const pillars = [
  { icon: "lock",         title: "Criptografia de ponta a ponta", desc: "AES-256 em repouso e TLS 1.3 em trânsito. Todos os dados sensíveis — incluindo prontuários — são criptografados antes de serem armazenados.", iconCls: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" },
  { icon: "database",     title: "Backups automáticos",           desc: "Backups diários criptografados com retenção de 30 dias. Infraestrutura redundante em múltiplas zonas de disponibilidade.",                   iconCls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300" },
  { icon: "visibility",   title: "Controle de acesso (RBAC)",     desc: "Cada membro da equipe acessa apenas o que precisa. Logs de auditoria registram toda ação sensível na plataforma.",                          iconCls: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300" },
  { icon: "refresh",      title: "Disponibilidade 99.9%",         desc: "SLA garantido de 99.9% de uptime. Monitoramento 24/7 com alertas automáticos para qualquer anomalia.",                                       iconCls: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300" },
  { icon: "shield",       title: "Conformidade LGPD",             desc: "Adequação total à Lei nº 13.709/2018. DPO designado, contratos de processamento com fornecedores e mecanismos de direitos dos titulares.",    iconCls: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300" },
  { icon: "fact_check",   title: "Pentest e auditoria",           desc: "Testes de penetração semestrais por empresa independente. Resultados e remediações documentados e disponíveis para clientes no plano Pro.",   iconCls: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300" },
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
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        <section className="bg-primary/5 border-b border-primary/10 py-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shield</span>
            Infraestrutura segura
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-primary mb-4">
            Dados de saúde exigem<br />o máximo de proteção
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            No NaviClin, segurança e privacidade não são opcionais. São parte central da arquitetura.
          </p>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="border border-outline-variant rounded-2xl p-6 bg-surface-container-lowest shadow-premium-sm">
                <div className={`w-12 h-12 rounded-xl ${p.iconCls} flex items-center justify-center mb-4`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{p.icon}</span>
                </div>
                <h3 className="font-bold text-on-surface mb-2">{p.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 bg-surface-container-low">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">LGPD</span>
                <h2 className="font-headline font-extrabold text-2xl text-primary mb-4">Conformidade total com a Lei Geral de Proteção de Dados</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  O NaviClin foi projetado desde o início com privacy by design. Temos DPO designado, registro de operações de tratamento e processos documentados para atender os direitos dos titulares.
                </p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-premium-sm">
                <p className="font-semibold text-sm text-on-surface mb-4">Direitos que garantimos</p>
                <ul className="space-y-2.5">
                  {lgpdRights.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-emerald-600 shrink-0" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6 border-t border-outline-variant">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-headline font-bold text-xl text-primary mb-2">Fale com nosso DPO</h2>
            <p className="text-on-surface-variant text-sm mb-4">Dúvidas sobre privacidade e proteção de dados? Respondemos em até 72 horas úteis.</p>
            <a
              href="mailto:dpo@naviclin.com"
              className="inline-flex items-center gap-2 border border-primary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors text-sm"
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
