import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agenda Inteligente — NaviClin",
  description: "Conheça a agenda multi-profissional do NaviClin: encaixes automáticos, confirmação por WhatsApp e visão por sala.",
}

export default function AgendaDemoPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-primary/10 py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Produto · Agenda</span>
              <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-primary mb-4 leading-tight">
                Agenda inteligente<br /><em className="text-nc-secondary">multi-profissional</em>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                Encaixes automáticos, lembretes por WhatsApp, bloqueios por equipamento e visão por sala. Reduza faltas em até 42%.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="/cadastro" className="inline-flex items-center gap-2 surgical-gradient text-white font-semibold px-6 py-3 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity text-sm">
                  Testar grátis 14 dias
                </a>
                <a href="/contato" className="inline-flex items-center gap-2 border border-outline-variant text-primary font-semibold px-6 py-3 rounded-xl hover:bg-surface-container text-sm transition-colors">
                  Agendar demo
                </a>
              </div>
            </div>
            {/* Mock agenda card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-premium overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-container border-b border-outline-variant">
                {["#E26762","#E4B33D","#5EAC5A"].map((c, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block" }} />
                ))}
                <span className="ml-2 text-xs text-on-surface-variant font-mono">app.naviclin.com.br/agenda</span>
              </div>
              <div className="p-5 space-y-2">
                {[
                  { time: "09:00", name: "Ana Lopes", proc: "Limpeza", col: "#C9943A" },
                  { time: "10:30", name: "João Prado", proc: "Implante — 1ª sessão", col: "#0D3A6B" },
                  { time: "11:15", name: "Carla Mendes", proc: "Canal", col: "#4B5A95" },
                  { time: "14:00", name: "Marcelo Viana", proc: "Ortodontia — ajuste", col: "#C9943A" },
                  { time: "14:45", name: "Clara Sousa", proc: "Prótese", col: "#1A8A5A" },
                  { time: "15:30", name: "Olívia Matos", proc: "Radiografia", col: "#4B5A95" },
                ].map((a) => (
                  <div key={a.time} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-background">
                    <div style={{ width: 3, height: 32, borderRadius: 2, background: a.col, flexShrink: 0 }} />
                    <span className="text-xs font-bold text-nc-secondary font-mono w-10 shrink-0">{a.time}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-on-surface">{a.name}</div>
                      <div className="text-xs text-on-surface-variant">{a.proc}</div>
                    </div>
                    <span className="text-xs font-semibold bg-primary/8 text-primary px-2 py-1 rounded-full">Confirmado</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline font-extrabold text-2xl text-primary text-center mb-10">
              O que a agenda do NaviClin faz por você
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "notifications_active", title: "Confirmação automática", desc: "WhatsApp e email automáticos 24h e 2h antes da consulta. Taxa de faltas reduzida em até 42%.", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300" },
                { icon: "calendar_month", title: "Multi-profissional e sala", desc: "Cada profissional com sua agenda. Bloqueios por sala, equipamento ou procedimento.", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" },
                { icon: "auto_fix_high", title: "Encaixes inteligentes", desc: "O sistema sugere automaticamente o melhor horário disponível conforme duração do procedimento.", color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300" },
                { icon: "history", title: "Histórico completo", desc: "Veja todos os agendamentos passados e futuros de cada paciente em uma única tela.", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300" },
                { icon: "smartphone", title: "Portal do paciente", desc: "O paciente acessa seus agendamentos, recebe lembretes e pode confirmar pelo celular.", color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300" },
                { icon: "analytics", title: "Métricas de agenda", desc: "Taxa de ocupação, faltas, cancelamentos e horários de pico. Tome decisões com dados.", color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300" },
              ].map((f) => (
                <div key={f.title} className="border border-outline-variant rounded-2xl p-5 bg-surface-container-lowest shadow-premium-sm">
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-3`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-1 text-sm">{f.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="surgical-gradient py-16 px-6">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="font-headline font-extrabold text-3xl mb-4">Comece a usar hoje, grátis</h2>
            <p className="text-white/70 mb-6">14 dias grátis. Sem cartão de crédito. Cancele quando quiser.</p>
            <a href="/cadastro" className="inline-flex items-center gap-2 bg-nc-secondary text-white font-semibold px-8 py-4 rounded-xl shadow-glow-gold hover:opacity-90 transition-opacity">
              Testar grátis agora
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
