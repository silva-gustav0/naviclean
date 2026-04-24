import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financeiro em Tempo Real — NaviClin",
  description: "Controle financeiro completo para clínicas: DRE automático, comissões por profissional e conciliação bancária.",
}

export default function FinanceiroDemoPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-primary/10 py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Produto · Financeiro</span>
              <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-primary mb-4 leading-tight">
                Financeiro em<br /><em className="text-nc-secondary">tempo real</em>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                Contas a pagar e receber, comissões por profissional, conciliação bancária e DRE automático. Sem planilhas, sem surpresas.
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
            {/* Mock financeiro card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-premium overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-container border-b border-outline-variant">
                {["#E26762","#E4B33D","#5EAC5A"].map((c, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block" }} />
                ))}
                <span className="ml-2 text-xs text-on-surface-variant font-mono">app.naviclin.com.br/financeiro</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { l: "Faturamento", n: "R$ 184.720", up: true, d: "+18,4%" },
                    { l: "Lucro líq.", n: "R$ 112.590", up: true, d: "+24,7%" },
                    { l: "Despesas", n: "R$ 72.130", up: false, d: "+4,1%" },
                    { l: "Ticket médio", n: "R$ 412", up: true, d: "+R$28" },
                  ].map((s) => (
                    <div key={s.l} className="bg-background border border-outline-variant rounded-xl p-3">
                      <div className="text-xs text-on-surface-variant mb-1">{s.l}</div>
                      <div className="font-headline text-lg font-medium text-on-surface">{s.n}</div>
                      <div className={`text-xs font-semibold ${s.up ? "text-emerald-600" : "text-rose-600"}`}>{s.d}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { icon: "+", label: "Ana Lopes · Limpeza", val: "R$ 220", pos: true },
                    { icon: "+", label: "Marcelo Viana · Implante", val: "R$ 3.800", pos: true },
                    { icon: "–", label: "Fornecedor Dental · NF", val: "R$ 1.240", pos: false },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-outline-variant last:border-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${t.pos ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"}`}>{t.icon}</div>
                      <div className="flex-1 text-xs text-on-surface">{t.label}</div>
                      <div className={`text-sm font-bold ${t.pos ? "text-emerald-600" : "text-rose-600"}`}>{t.val}</div>
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
              Gestão financeira de alto nível
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "trending_up", title: "DRE automático", desc: "Demonstrativo de resultado gerado automaticamente. Sem contador, sem planilhas manuais.", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300" },
                { icon: "account_balance", title: "Conciliação bancária", desc: "Conecte sua conta e o sistema concilia automaticamente receitas e despesas.", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" },
                { icon: "payments", title: "Comissões automáticas", desc: "Defina regras de comissão por profissional e procedimento. Repasse calculado automaticamente.", color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300" },
                { icon: "receipt_long", title: "Emissão de NFS-e", desc: "Nota fiscal de serviços eletrônica gerada automaticamente após cada atendimento pago.", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300" },
                { icon: "credit_card", title: "Multi forma de pagamento", desc: "Cartão, PIX, boleto e parcelas. Controle de inadimplência integrado.", color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300" },
                { icon: "bar_chart", title: "Relatórios gerenciais", desc: "Relatórios por período, profissional, procedimento ou convênio. Exportação em Excel e PDF.", color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300" },
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
            <h2 className="font-headline font-extrabold text-3xl mb-4">Seu financeiro, sob controle</h2>
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
