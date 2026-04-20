import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre — NaviClin",
  description: "Conheça a história, missão e time por trás do NaviClin, o software de gestão para clínicas odontológicas e médicas.",
}

const team = [
  { name: "Carlos Andrade",   role: "CEO & Co-fundador",              initials: "CA", cls: "surgical-gradient" },
  { name: "Juliana Mendes",   role: "CTO & Co-fundadora",             initials: "JM", cls: "surgical-gradient" },
  { name: "Rafael Lima",      role: "Head de Produto",                initials: "RL", cls: "surgical-gradient" },
  { name: "Fernanda Costa",   role: "Head de Sucesso do Cliente",     initials: "FC", cls: "surgical-gradient" },
]

const values = [
  { icon: "gps_fixed",    label: "Foco no resultado",        desc: "Cada funcionalidade existe para resolver um problema real de clínicas brasileiras.",                       iconCls: "bg-blue-50 text-blue-600" },
  { icon: "favorite",     label: "Cuidado humano",           desc: "Acreditamos que tecnologia deve liberar tempo para o que importa: cuidar de pessoas.",                    iconCls: "bg-rose-50 text-rose-600" },
  { icon: "shield",       label: "Confiança e privacidade",  desc: "Dados de saúde são sagrados. Segurança e conformidade LGPD não são opcionais.",                          iconCls: "bg-emerald-50 text-emerald-600" },
  { icon: "bolt",         label: "Simplicidade que escala",  desc: "Simples para começar, poderoso para crescer. Sem curva de aprendizado desnecessária.",                    iconCls: "bg-amber-50 text-amber-600" },
]

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        <section className="bg-primary/5 border-b border-primary/10 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-primary mb-6">
              Nascemos para transformar<br />a gestão de clínicas no Brasil
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              O NaviClin surgiu da frustração de dentistas e médicos com ferramentas desatualizadas, planilhas confusas e sistemas caros que não entregavam valor real.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="font-headline font-extrabold text-2xl text-primary mb-4">Nossa história</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Fundado em 2022 por Carlos e Juliana, o NaviClin nasceu após meses de entrevistas com donos de clínicas em todo o Brasil. A pergunta era simples: &ldquo;O que te faz perder mais tempo?&rdquo;. As respostas? Sempre as mesmas — agenda bagunçada, paciente que falta sem avisar, controle financeiro no Excel, prontuário em papel.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Em 18 meses construímos do zero uma plataforma moderna, integrada e acessível. Hoje, mais de 500 clínicas em 23 estados confiam no NaviClin para rodar o dia a dia — da recepção ao consultório, do financeiro ao marketing.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Nossa missão é clara: dar ao dentista e ao médico brasileiro ferramentas de primeira linha para que possam focar no que escolheram fazer — cuidar de pessoas.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 bg-surface-container-low">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline font-extrabold text-2xl text-primary text-center mb-10">Nossos valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.label} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex gap-4 shadow-premium-sm">
                  <div className={`w-12 h-12 rounded-xl ${v.iconCls} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{v.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface mb-1">{v.label}</h3>
                    <p className="text-sm text-on-surface-variant">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline font-extrabold text-2xl text-primary text-center mb-10">Nosso time</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className={`w-20 h-20 rounded-2xl ${member.cls} flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold shadow-premium`}>
                    {member.initials}
                  </div>
                  <p className="font-semibold text-sm text-on-surface">{member.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surgical-gradient py-16 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { n: "+500",  label: "Clínicas ativas" },
              { n: "23",    label: "Estados atendidos" },
              { n: "+50k",  label: "Pacientes cadastrados" },
              { n: "99.9%", label: "Uptime garantido" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-black text-nc-secondary">{s.n}</p>
                <p className="text-white/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
