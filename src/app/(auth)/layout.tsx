import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left: form */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-surface py-12">
        <Link href="/" className="mb-12">
          <span className="text-2xl font-extrabold tracking-tight text-primary font-headline">NaviClin</span>
        </Link>
        <div className="max-w-md w-full">
          {children}
        </div>
        <div className="mt-auto pt-12 flex items-center gap-6 text-[10px] text-outline font-sans uppercase tracking-widest">
          <span className="font-bold text-primary">© 2024 NaviClin</span>
          <Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
          <Link href="/seguranca" className="hover:text-primary transition-colors">Segurança</Link>
        </div>
      </section>

      {/* Right: visual */}
      <section className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-end p-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-nc-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-1 bg-nc-secondary mb-8" />
          <h2 className="text-4xl font-extrabold font-headline text-white mb-6 leading-tight">
            &ldquo;O NaviClin transformou a gestão da nossa clínica. É o padrão ouro em SaaS odontológico.&rdquo;
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
              AP
            </div>
            <div>
              <p className="text-white font-bold font-headline">Dra. Ana Paula Ferreira</p>
              <p className="text-on-primary-container text-sm font-sans uppercase tracking-wider">
                Diretora Clínica, Sorriso Perfeito
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-20 z-10 opacity-10">
          <span className="material-symbols-outlined text-white" style={{ fontSize: 180 }}>medical_services</span>
        </div>
      </section>
    </div>
  )
}
