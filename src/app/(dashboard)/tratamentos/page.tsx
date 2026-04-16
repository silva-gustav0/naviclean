import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Stethoscope, Clock, DollarSign, Tag } from "lucide-react"
import { NewServiceModal } from "@/components/dashboard/modals/new-service-modal"
import Link from "next/link"

export default async function TratamentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: services } = await supabase
    .from("services")
    .select("*, service_prices(id, price, price_tables(name))")
    .eq("clinic_id", clinic.id)
    .order("name")

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tratamentos</h1>
          <p className="text-muted-foreground text-sm">
            {services?.length ?? 0} serviço{(services?.length ?? 0) !== 1 ? "s" : ""} cadastrado{(services?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <NewServiceModal />
      </div>

      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.id as string} className="bg-white dark:bg-slate-900 border rounded-2xl p-5 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-cyan-600" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  s.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-slate-100 text-slate-500"
                }`}>
                  {s.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{s.name as string}</h3>
              {s.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{s.description as string}</p>}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {s.price && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-semibold text-foreground">{fmt(Number(s.price))}</span>
                  </div>
                )}
                {s.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{s.duration_minutes} min</span>
                  </div>
                )}
                {s.category && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{s.category as string}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-cyan-600" />
          </div>
          <h3 className="font-semibold text-base mb-1">Nenhum tratamento cadastrado</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Adicione os serviços oferecidos pela sua clínica para usar no agendamento.
          </p>
          <NewServiceModal />
        </div>
      )}
    </div>
  )
}
