import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prontuário Digital — NaviClin",
  description: "Prontuário digital completo: odontograma interativo, anamnese personalizada e histórico em um só clique.",
}

export default function ProntuarioDemoPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-primary/10 py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Produto · Prontuário</span>
              <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-primary mb-4 leading-tight">
                Prontuário digital<br /><em className="text-nc-secondary">completo e seguro</em>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                Odontograma interativo, anamnese personalizada e histórico de exames em um só clique. Tudo com assinatura digital e conformidade legal.
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
            {/* Mock prontuário card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-premium overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-container border-b border-outline-variant">
                {["#E26762","#E4B33D","#5EAC5A"].map((c, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block" }} />
                ))}
                <span className="ml-2 text-xs text-on-surface-variant font-mono">app.naviclin.com.br/prontuario</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-outline-variant">
                  <div className="w-10 h-10 rounded-full bg-nc-secondary/15 text-nc-secondary flex items-center justify-center font-bold text-sm">CS</div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">Clara Sousa</div>
                    <div className="text-xs text-on-surface-variant">ID #04821 · Desde Mar/2022</div>
                  </div>
                  <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">⚠ Alergia</span>
                </div>
                <div className="space-y-3">
                  {[
                    { date: "02 abr 2026", title: "Ajuste ortodôntico", desc: "Troca de fio 014 → 016." },
                    { date: "15 mar 2026", title: "Restauração dente 27", desc: "Resina composta." },
                    { date: "28 fev 2026", title: "Profilaxia completa", desc: "Limpeza + flúor." },
                  ].map((e) => (
                    <div key={e.date} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-nc-secondary/15 text-nc-secondary flex items-center justify-center text-xs shrink-0 mt-0.5">✦</div>
                      <div>
                        <div className="text-xs text-on-surface-variant">{e.date}</div>
                        <div className="text-sm font-semibold text-on-surface">{e.title}</div>
                        <div className="text-xs text-on-surface-variant">{e.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline font-extrabold text-2xl text-primary text-center mb-10">
              Tudo que um prontuário moderno precisa ter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "format_list_bulleted", title: "Odontograma interativo", desc: "Marque tratamentos, próteses e implantes diretamente no diagrama dental. Exportável em PDF.", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" },
                { icon: "assignment", title: "Anamnese personalizada", desc: "Crie formulários de anamnese por especialidade. O paciente preenche antes mesmo de chegar.", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300" },
                { icon: "history", title: "Histórico completo", desc: "Evoluções, receitas, exames e imagens organizados cronologicamente. Acesso em um clique.", color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300" },
                { icon: "draw", title: "Assinatura digital", desc: "Termos de consentimento e receitas assinados digitalmente pelo paciente com validade jurídica.", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300" },
                { icon: "shield", title: "Segurança LGPD", desc: "Dados criptografados, controle de acesso por função e logs de auditoria de todos os acessos.", color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300" },
                { icon: "picture_as_pdf", title: "Exportação em PDF", desc: "Gere prontuários em PDF formatados e padronizados para envio a convênios ou encaminhamentos.", color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300" },
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
            <h2 className="font-headline font-extrabold text-3xl mb-4">Prontuário sem papel, sem limite</h2>
            <p className="text-white/70 mb-6">14 dias grátis. Sem cartão de crédito. Cancele quando quiser.</p>
            <a href="/cadastro" className="inline-flex items-center gap-2 bg-nc-secondary text-white font-semibold px-8 py-4 rounded-xl shadow-glow-gold hover:opacity-90 transition-opacity">
              Começar agora grátis
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
