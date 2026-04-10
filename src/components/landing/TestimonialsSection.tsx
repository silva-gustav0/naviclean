const testimonials = [
  {
    quote:
      "A transição para o NaviClean foi o divisor de águas na minha clínica. O prontuário digital é intuitivo e me economiza pelo menos 1 hora de burocracia por dia.",
    name: "Dra. Camila Santos",
    role: "CEO, SmileCare Clinic — São Paulo",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAR43bX0FCoyWxHUE9cmnEEbbqHeiMwgvdsKQV7YIuolNEpzEO3HQjDIKGQNS8VSvBbAlRarf5Ndhn5881266jdKz42_JhlFOmDP0iQvuyCprXI2cRf077SUhI-gZbgRzLzuvzgh9EtIWxzHvHfmc5-ZmW2lD9wbC_pnmwwXFEMw2YmYRq4-oUtSyccOCG5NBvBzNbV7DYeTmxjZn1nwLKWHTlUZPj21omkH4KMnC1jhTxrCq3yMy6ce7KOBZhFq55-oliGFZHdoWc",
    rating: 5,
  },
  {
    quote:
      "O controle financeiro do NaviClean é incomparável. Finalmente tenho clareza sobre meus repasses e lucratividade real de cada procedimento.",
    name: "Dr. Ricardo Menezes",
    role: "Diretor Clínico, Menezes Odontologia — Curitiba",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMMzgAf2GVFCNA7WepFo4XGveDlauvuSJfFa8B9kh5oWXLXOyi4HPmXnTxD0BwyHUTU1p_DbVxUdcPkxpXA3jKAuTHkIcNYqRwsBq3tSRjXyeqQQIATYjoS81T_wWD1rFf-zudV0_7M0Hd3n-HWo2NsEXwCXVqHlwogeEqJM9dL2fKOXZfsgQr00aeBCcW-vWyiDoESx3nZd65nG3JsW3Ok2WE3r9OUmE-14Owoi8TW5u-G-qxU6-bRPZWu6J9LVrmIawPJn5gWVs",
    rating: 5,
  },
  {
    quote:
      "O agendamento online reduziu em 40% as faltas na nossa clínica. Os lembretes automáticos pelo WhatsApp foram um game changer para a nossa equipe.",
    name: "Dra. Marina Oliveira",
    role: "Ortodontista, Clínica OrtoCenter — Belo Horizonte",
    avatar: "CS",
    initials: "MO",
    rating: 5,
  },
  {
    quote:
      "Gerenciar 3 unidades ao mesmo tempo parecia impossível. Com o NaviClean, tenho uma visão consolidada de tudo em tempo real. Recomendo para qualquer rede.",
    name: "Dr. Felipe Andrade",
    role: "Diretor, Grupo DentalPro — São Paulo",
    avatar: "FA",
    initials: "FA",
    rating: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">
            Depoimentos
          </span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mt-3 leading-tight">
            Histórias de sucesso com precisão digital
          </h2>
        </div>
        <div className="flex flex-col items-center bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100">
          <span className="text-3xl font-black text-blue-600">4.9/5</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
            Nota no Capterra
          </span>
          <StarRating count={5} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-white p-8 lg:p-10 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <StarRating count={t.rating} />
            <p className="text-slate-700 text-lg font-medium leading-relaxed my-6 italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              {t.avatar.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-blue-100"
                  style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
                >
                  {t.initials}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-slate-400 text-xs">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
