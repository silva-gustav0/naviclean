import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="space-y-4 max-w-2xl">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto">
          <span className="text-primary-foreground font-bold text-2xl">N</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Gerencie sua clinica odontologica com inteligencia
        </h1>
        <p className="text-xl text-muted-foreground">
          Agendamentos online, prontuarios digitais, controle financeiro e muito mais.
          Tudo em uma so plataforma.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/cadastro">
            <Button size="lg">Comecar 14 dias gratis</Button>
          </Link>
          <Link href="/planos">
            <Button size="lg" variant="outline">Ver planos</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">Sem cartao de credito. Cancele quando quiser.</p>
      </div>
    </main>
  )
}
