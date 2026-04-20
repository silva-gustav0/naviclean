import Link from "next/link"

export function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24 lg:pb-32">
      <div className="relative rounded-[2.5rem] overflow-hidden animated-gradient-bg p-16 lg:p-24 text-center text-white">
        {/* Decoration blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-nc-secondary/15 rounded-full blur-3xl pointer-events-none" />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-nc-secondary opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-nc-secondary" />
            </span>
            Comece hoje — sem compromisso
          </div>

          <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] font-headline mb-6">
            Pronto para elevar<br />
            <span className="text-gradient-gold">o nível da sua gestão?</span>
          </h2>

          <p className="text-xl text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Junte-se a mais de 500 clínicas que já transformaram seu atendimento.<br />14 dias grátis, sem cartão de crédito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/cadastro">
              <button className="btn-pill-arrow group flex items-center gap-3 bg-white text-primary font-extrabold text-lg px-10 py-4 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:bg-surface-container-low hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 font-headline">
                Criar minha conta grátis
                <span className="arrow-circle w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>arrow_forward</span>
                </span>
              </button>
            </Link>
            <Link href="#planos">
              <button className="flex items-center gap-2 text-white/80 font-semibold text-lg px-8 py-4 rounded-full border-2 border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.97] transition-all duration-200 font-headline">
                Ver planos e preços
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/40 text-sm">
            {["Sem contrato de fidelidade", "Cancele quando quiser", "Suporte em português", "LGPD compliance"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-white/30" style={{ fontSize: 14 }}>check_circle</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
