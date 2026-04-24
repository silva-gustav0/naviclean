import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre — NaviClin",
  description: "Conheça a história, missão e time por trás do NaviClin, o software de gestão para clínicas odontológicas e médicas.",
}

const team = [
  { name: "Dr. Matheus Medeiros", role: "CEO & Co-fundador", initials: "MM", cls: "surgical-gradient" },
  { name: "Gustavo Ramalho",      role: "CTO & Co-fundador", initials: "GR", cls: "surgical-gradient" },
]

const values = [
  { icon: "gps_fixed",    label: "Foco no resultado",        desc: "Cada funcionalidade existe para resolver um problema real de clínicas brasileiras.",               iconCls: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" },
  { icon: "favorite",     label: "Cuidado humano",           desc: "Acreditamos que tecnologia deve liberar tempo para o que importa: cuidar de pessoas.",                iconCls: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300" },
  { icon: "shield",       label: "Confiança e privacidade",  desc: "Dados de saúde são sagrados. Segurança e conformidade LGPD não são opcionais.",                        iconCls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300" },
  { icon: "bolt",         label: "Simplicidade que escala",  desc: "Simples para começar, poderoso para crescer. Sem curva de aprendizado desnecessária.",                 iconCls: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300" },
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
              De um lado, Matheus, imerso na realidade da odontologia e da linha de frente do atendimento. No dia a dia clínico, a frustração era evidente: o tempo e a energia que deveriam ser dedicados exclusivamente à saúde e ao acolhimento dos pacientes eram constantemente engolidos por processos burocráticos. Fichas de papel se perdendo, horários vagos por falta de comunicação e a gestão financeira sendo feita de forma amadora. A burocracia estava limitando o potencial do cuidado humano.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Do outro lado, Gustavo, a mente técnica. Com sua expertise em arquitetura de software, ele via com clareza que a tecnologia para resolver aquele caos já existia, mas os sistemas disponíveis no mercado eram engessados, caros ou desenvolvidos por pessoas que nunca haviam pisado em um consultório.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              A ideia da NaviClin surgiu da fusão dessas duas visões: a vivência clínica de quem entende a dor diária do profissional da saúde, unida à capacidade técnica de quem sabe construir a solução exata.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              O que começou como um projeto para resolver uma dor próxima logo se tornou uma missão maior. Nós percebemos que não poderíamos guardar essa solução. A motivação passou a ser construir uma plataforma de ponta, com tecnologia de grandes hospitais, mas que fosse acessível e intuitiva para o uso de todos. Queríamos democratizar a gestão de excelência, dando a médicos, dentistas e gestores de todo o Brasil a chance de automatizar seus problemas e voltar a focar naquilo que realmente importa: <strong>cuidar de pessoas.</strong>
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
            <div className="flex justify-center gap-8 flex-wrap">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className={`w-24 h-24 rounded-2xl ${member.cls} flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold shadow-premium`}>
                    {member.initials}
                  </div>
                  <p className="font-semibold text-base text-on-surface">{member.name}</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">{member.role}</p>
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
