import Link from "next/link"

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Text */}
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-full border border-blue-100">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          14 dias grátis · Sem cartão de crédito
        </div>

        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          Gerencie sua clínica odontológica com{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
          >
            inteligência
          </span>
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
          A plataforma definitiva para dentistas de alta performance. Agendamento online,
          prontuário digital e controle financeiro em uma interface de precisão clínica.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/cadastro">
            <button
              className="px-8 py-4 rounded-full font-bold text-white text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
            >
              Começar 14 dias grátis
            </button>
          </Link>
          <Link href="#planos">
            <button className="px-8 py-4 rounded-full font-bold text-blue-600 text-lg border-2 border-blue-600 hover:bg-blue-50 active:scale-[0.98] transition-all duration-200">
              Ver planos
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex -space-x-2">
            {["C", "A", "R", "M"].map((l, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: `hsl(${220 + i * 15}, 70%, ${45 + i * 5}%)`,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">+500 dentistas</span> já usam o NaviClin
          </p>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative">
        <div className="absolute -inset-4 bg-blue-500/5 rounded-[2rem] blur-3xl" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz6Y2Z_eDUp_D2QYOKRs39Tf4-ZQg1lt4i1FPydQZVt8bbiuOtlqCwGIfLLC8jBvSK-OWy9eSi-TJIA8a0Q77jkiel4OAWIk6ik1Y8zW5gUNA2j57JWhCOEH9vvzRht2fSKUsJGJ9g-KzVd-gFh6B0zzMH5kE6qKAvbk2VrYZyWO439H7xPhk9NAqqU7kzB2El_HNfE4_4OtBdpQZ2fOmq1A7GdpVwvzP_rjwK6QlTZr_oFZnLA2M4rUzEQ24M33iL_PtkT2w7x_A"
          alt="Dashboard NaviClin - painel de gestão odontológica"
          className="relative rounded-2xl shadow-2xl border border-slate-100 object-cover w-full"
        />
      </div>
    </section>
  )
}
