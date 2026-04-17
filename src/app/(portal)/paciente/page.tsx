import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const QUICK_LINKS = [
  { href: "/paciente/agendamentos", icon: "calendar_month",  label: "Agendamentos", iconCls: "bg-blue-50 text-blue-600" },
  { href: "/paciente/receitas",     icon: "description",     label: "Receitas",      iconCls: "bg-violet-50 text-violet-600" },
  { href: "/paciente/financeiro",   icon: "payments",        label: "Financeiro",    iconCls: "bg-emerald-50 text-emerald-600" },
  { href: "/buscar",                icon: "search",          label: "Buscar clínica", iconCls: "bg-amber-50 text-amber-600" },
]

export default async function PortalPacientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/paciente/login")

  const { data: patient } = await supabase.from("patients").select("id").eq("user_id", user.id).single()
  const patientId = patient?.id ?? ""

  const [{ data: appointments }, { data: prescriptions }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, date, start_time, status, clinics(name), services(name)")
      .eq("patient_id", patientId)
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date")
      .limit(3),
    supabase
      .from("prescriptions")
      .select("id, created_at, title, type")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(3),
  ])

  const nextAppt = appointments?.[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Olá, bem-vindo(a)!</h1>
        <p className="text-on-surface-variant text-sm">Portal do paciente NaviClin</p>
      </div>

      <div className="surgical-gradient rounded-2xl p-5 text-white shadow-premium">
        <p className="text-white/60 text-xs font-medium mb-2">Próximo agendamento</p>
        {nextAppt ? (
          <>
            <p className="text-lg font-bold">
              {new Date(nextAppt.date as string).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <p className="text-white/70 text-sm mt-1">
              {nextAppt.start_time as string} · {(nextAppt.services as { name: string } | null)?.name ?? "Consulta"}
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              {(nextAppt.clinics as { name: string } | null)?.name}
            </p>
          </>
        ) : (
          <p className="text-white/60 text-sm">Nenhum agendamento próximo</p>
        )}
        <Link
          href="/paciente/agendamentos"
          className="inline-flex items-center gap-1 text-xs text-nc-secondary hover:text-[#F0D9B0] mt-3 font-medium transition-colors"
        >
          Ver todos
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-premium-sm transition-all"
          >
            <div className={`w-9 h-9 rounded-xl ${item.iconCls} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
            </div>
            <span className="text-sm font-medium text-on-surface">{item.label}</span>
          </Link>
        ))}
      </div>

      {prescriptions && prescriptions.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
            <h2 className="font-semibold text-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-violet-600" style={{ fontSize: 16 }}>description</span>
              Receitas ativas
            </h2>
            <Link href="/paciente/receitas" className="text-xs text-primary hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {prescriptions.map((p) => (
              <div key={p.id as string} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">{(p.title as string) || "Receita médica"}</p>
                  <p className="text-xs text-on-surface-variant">{new Date(p.created_at as string).toLocaleDateString("pt-BR")}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
