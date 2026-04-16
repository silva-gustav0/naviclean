import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"
import { Target, Heart, Shield, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Sobre — NaviClin",
  description: "Conheça a história, missão e time por trás do NaviClin, o software de gestão para clínicas odontológicas e médicas.",
}

const team = [
  { name: "Carlos Andrade", role: "CEO & Co-fundador", initials: "CA", bg: "from-blue-600 to-violet-600" },
  { name: "Juliana Mendes", role: "CTO & Co-fundadora", initials: "JM", bg: "from-violet-600 to-pink-600" },
  { name: "Rafael Lima", role: "Head de Produto", initials: "RL", bg: "from-cyan-600 to-blue-600" },
  { name: "Fernanda Costa", role: "Head de Sucesso do Cliente", initials: "FC", bg: "from-emerald-600 to-teal-600" },
]

const values = [
  { icon: Target, label: "Foco no resultado", desc: "Cada funcionalidade existe para resolver um problema real de clínicas brasileiras.", color: "bg-blue-50 text-blue-600" },
  { icon: Heart, label: "Cuidado humano", desc: "Acreditamos que tecnologia deve liberar tempo para o que importa: cuidar de pessoas.", color: "bg-rose-50 text-rose-600" },
  { icon: Shield, label: "Confiança e privacidade", desc: "Dados de saúde são sagrados. Segurança e conformidade LGPD não são opcionais.", color: "bg-emerald-50 text-emerald-600" },
  { icon: Zap, label: "Simplicidade que escala", desc: "Simples para começar, poderoso para crescer. Sem curva de aprendizado desnecessária.", color: "bg-amber-50 text-amber-600" },
]

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
              Nascemos para transformar<br />a gestão de clínicas no Brasil
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              O NaviClin surgiu da frustração de dentistas e médicos com ferramentas desatualizadas, planilhas confusas e sistemas caros que não entregavam valor real.
            </p>
          </div>
        </section>

        {/* História */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Nossa história</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Fundado em 2022 por Carlos e Juliana, o NaviClin nasceu após meses de entrevistas com donos de clínicas em todo o Brasil. A pergunta era simples: &ldquo;O que te faz perder mais tempo?&rdquo;. As respostas? Sempre as mesmas — agenda bagunçada, paciente que falta sem avisar, controle financeiro no Excel, prontuário em papel.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Em 18 meses construímos do zero uma plataforma moderna, integrada e acessível. Hoje, mais de 500 clínicas em 23 estados confiam no NaviClin para rodar o dia a dia — da recepção ao consultório, do financeiro ao marketing.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Nossa missão é clara: dar ao dentista e ao médico brasileiro ferramentas de primeira linha para que possam focar no que escolheram fazer — cuidar de pessoas.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 px-6 bg-[#F7F9FC]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#0F172A] mb-10">Nossos valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.label} className="bg-white border rounded-2xl p-6 flex gap-4">
                  <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center shrink-0`}>
                    <v.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{v.label}</h3>
                    <p className="text-sm text-slate-600">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Time */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#0F172A] mb-10">Nosso time</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.bg} flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold shadow-lg`}>
                    {member.initials}
                  </div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Números */}
        <section className="py-16 px-6 bg-[#0D3A6B]">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { n: "+500", label: "Clínicas ativas" },
              { n: "23", label: "Estados atendidos" },
              { n: "+50k", label: "Pacientes cadastrados" },
              { n: "99.9%", label: "Uptime garantido" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-black text-[#DBB47A]">{s.n}</p>
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
