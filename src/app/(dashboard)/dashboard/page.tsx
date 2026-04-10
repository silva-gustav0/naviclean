import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) redirect("/onboarding")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ola! 👋</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel da {clinic.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Agendamentos Hoje", value: "0", desc: "Nenhum agendamento" },
          { label: "Pacientes Ativos", value: "0", desc: "Cadastre o primeiro" },
          { label: "Receita do Mes", value: "R$ 0,00", desc: "Sem movimentacoes" },
          { label: "Trial expira em", value: "14 dias", desc: "Aproveite gratis" },
        ].map((card) => (
          <div key={card.label} className="rounded-lg border bg-card p-6 space-y-1">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold mb-2">Proximos passos</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>→ Configure os horarios de atendimento em <strong>Configuracoes → Horarios</strong></li>
          <li>→ Adicione seus tratamentos em <strong>Tratamentos</strong></li>
          <li>→ Cadastre sua equipe em <strong>Equipe</strong></li>
          <li>→ Crie o primeiro paciente em <strong>Pacientes</strong></li>
        </ul>
      </div>
    </div>
  )
}
