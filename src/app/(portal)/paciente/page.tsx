import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar, FileText, DollarSign, Star, ChevronRight } from "lucide-react"
import Link from "next/link"

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
        <h1 className="text-2xl font-bold">Olá, bem-vindo(a)!</h1>
        <p className="text-muted-foreground text-sm">Portal do paciente NaviClin</p>
      </div>

      {/* Próximo agendamento */}
      <div className="bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] rounded-2xl p-5 text-white">
        <p className="text-blue-200 text-xs font-medium mb-2">Próximo agendamento</p>
        {nextAppt ? (
          <>
            <p className="text-lg font-bold">
              {new Date(nextAppt.date as string).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {nextAppt.start_time as string} · {(nextAppt.services as { name: string } | null)?.name ?? "Consulta"}
            </p>
            <p className="text-blue-300 text-xs mt-0.5">
              {(nextAppt.clinics as { name: string } | null)?.name}
            </p>
          </>
        ) : (
          <p className="text-blue-200 text-sm">Nenhum agendamento próximo</p>
        )}
        <Link
          href="/paciente/agendamentos"
          className="inline-flex items-center gap-1 text-xs text-[#DBB47A] hover:text-[#F0D9B0] mt-3 font-medium transition-colors"
        >
          Ver todos
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/paciente/agendamentos", icon: Calendar, label: "Agendamentos", color: "bg-blue-50 text-blue-600" },
          { href: "/paciente/receitas", icon: FileText, label: "Receitas", color: "bg-violet-50 text-violet-600" },
          { href: "/paciente/financeiro", icon: DollarSign, label: "Financeiro", color: "bg-emerald-50 text-emerald-600" },
          { href: "/buscar", icon: Star, label: "Buscar clínica", color: "bg-amber-50 text-amber-600" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center gap-3 hover:border-[#0D3A6B]/30 hover:shadow-sm transition-all"
          >
            <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Receitas recentes */}
      {prescriptions && prescriptions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-violet-600" />
              Receitas ativas
            </h2>
            <Link href="/paciente/receitas" className="text-xs text-blue-600 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y">
            {prescriptions.map((p) => (
              <div key={p.id as string} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{(p.title as string) || "Receita médica"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.created_at as string).toLocaleDateString("pt-BR")}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
