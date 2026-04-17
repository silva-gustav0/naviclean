const stats = [
  { value: "+500", label: "Clínicas ativas" },
  { value: "4.9/5", label: "Nota média" },
  { value: "40%", label: "Menos faltas" },
  { value: "R$28k", label: "Receita média/mês" },
]

export function SocialProof() {
  return (
    <section className="bg-surface-container-low py-14 border-y border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-outline mb-10 uppercase font-sans">
          A plataforma de referência para clínicas odontológicas
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-extrabold text-primary font-headline">{s.value}</p>
              <p className="text-xs text-on-surface-variant font-sans mt-1 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
