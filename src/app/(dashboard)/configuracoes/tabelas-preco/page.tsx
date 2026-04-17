import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { PriceTableModal } from "@/components/dashboard/modals/price-table-modal"
import { PriceTableEditor } from "@/components/dashboard/configuracoes/PriceTableEditor"

export default async function TabelasPrecoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const [{ data: tables }, { data: insurancePlans }, { data: services }] = await Promise.all([
    supabase
      .from("price_tables")
      .select("*, insurance_plans(name), service_prices(id, price, service_id)")
      .eq("clinic_id", clinic.id)
      .order("is_default", { ascending: false })
      .order("name"),
    supabase
      .from("insurance_plans")
      .select("id, name")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true),
    supabase
      .from("services")
      .select("id, name, price, category")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .order("name"),
  ])

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <Link href="/configuracoes" className="hover:text-primary transition-colors">Configurações</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-on-surface">Tabelas de Preço</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Tabelas de Preço</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">{tables?.length ?? 0} tabelas cadastradas</p>
        </div>
        <PriceTableModal insurancePlans={insurancePlans ?? []} />
      </div>

      {(tables ?? []).length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>sell</span>
          <h3 className="font-semibold text-on-surface text-base mb-1">Nenhuma tabela de preço</h3>
          <p className="text-on-surface-variant text-sm mb-4 max-w-xs mx-auto">
            Crie tabelas para particular e convênios com preços específicos por serviço.
          </p>
          <PriceTableModal insurancePlans={insurancePlans ?? []} />
        </div>
      ) : (
        <div className="space-y-4">
          {(tables ?? []).map((table) => {
            const insurancePlan = table.insurance_plans as { name: string } | null
            const servicePrices = (table.service_prices ?? []) as { id: string; price: number; service_id: string }[]
            return (
              <div key={table.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>sell</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-on-surface">{table.name}</span>
                        {table.is_default && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-nc-secondary/15 text-nc-secondary border border-nc-secondary/20 px-1.5 py-0.5 rounded-full font-medium">
                            <span className="material-symbols-outlined" style={{ fontSize: 10, fontVariationSettings: "'FILL' 1" }}>star</span>
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {table.type === "private" ? "Particular" : "Convênio"}
                        {insurancePlan ? ` · ${insurancePlan.name}` : ""}
                        {" · "}{servicePrices.length} serviços configurados
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${table.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                      {table.is_active ? "Ativa" : "Inativa"}
                    </span>
                    <PriceTableModal table={table} insurancePlans={insurancePlans ?? []} />
                  </div>
                </div>
                <PriceTableEditor
                  priceTableId={table.id}
                  services={services ?? []}
                  existingPrices={servicePrices}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
