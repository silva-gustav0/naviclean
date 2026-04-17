import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewServiceModal } from "@/components/dashboard/modals/new-service-modal"

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
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Tratamentos</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans">
            {services?.length ?? 0} serviço{(services?.length ?? 0) !== 1 ? "s" : ""} cadastrado{(services?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <NewServiceModal />
      </div>

      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div
              key={s.id as string}
              className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 hover:border-nc-secondary/30 hover:shadow-premium-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-nc-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stethoscope
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold font-sans ${
                  s.is_active ? "bg-emerald-50 text-emerald-700" : "bg-surface-container-low text-outline"
                }`}>
                  {s.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <h3 className="font-headline font-semibold text-primary mb-1">{s.name as string}</h3>
              {s.description && <p className="text-xs text-on-surface-variant mb-3 line-clamp-2 font-sans">{s.description as string}</p>}
              <div className="flex items-center gap-4 text-xs text-on-surface-variant font-sans">
                {s.price && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-nc-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    <span className="font-semibold text-primary">{fmt(Number(s.price))}</span>
                  </div>
                )}
                {s.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>{s.duration_minutes} min</span>
                  </div>
                )}
                {s.category && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">label</span>
                    <span>{s.category as string}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 py-16 text-center shadow-premium-sm">
          <div className="w-16 h-16 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-nc-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              stethoscope
            </span>
          </div>
          <h3 className="font-headline font-semibold text-primary text-base mb-1">Nenhum tratamento cadastrado</h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-xs mx-auto font-sans">
            Adicione os serviços oferecidos pela sua clínica para usar no agendamento.
          </p>
          <NewServiceModal />
        </div>
      )}
    </div>
  )
}
