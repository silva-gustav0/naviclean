import Link from "next/link"

export function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24 lg:pb-32">
      <div className="relative p-12 lg:p-20 rounded-3xl text-center text-white overflow-hidden surgical-gradient">
        {/* Decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-white/5" style={{ fontSize: 180, fontVariationSettings: "'FILL' 1" }}>
          medical_services
        </span>

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <span className="inline-block bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-white/20 font-sans">
            Comece hoje mesmo
          </span>

          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-headline">
            Pronto para elevar o nível da sua gestão?
          </h2>

          <p className="text-lg text-white/80 leading-relaxed font-sans">
            Junte-se a centenas de clínicas que já transformaram seu atendimento com o NaviClin.
            14 dias grátis, sem cartão de crédito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/cadastro">
              <button className="bg-white text-primary px-10 py-4 rounded-xl font-extrabold text-lg shadow-premium hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200 font-headline">
                Criar minha conta grátis
              </button>
            </Link>
            <Link href="#planos">
              <button className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 active:scale-[0.98] transition-all duration-200 font-headline">
                Ver planos
              </button>
            </Link>
          </div>

          <p className="text-white/50 text-sm font-sans">
            Sem contrato · Cancele quando quiser · Suporte em português
          </p>
        </div>
      </div>
    </section>
  )
}
