import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tag, Star } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/configuracoes" className="hover:text-foreground transition-colors">Configurações</Link>
            <span>/</span>
            <span>Tabelas de Preço</span>
          </div>
          <h1 className="text-2xl font-bold">Tabelas de Preço</h1>
          <p className="text-muted-foreground text-sm">{tables?.length ?? 0} tabelas cadastradas</p>
        </div>
        <PriceTableModal insurancePlans={insurancePlans ?? []} />
      </div>

      {(tables ?? []).length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-cyan-600" />
          </div>
          <h3 className="font-semibold text-base mb-1">Nenhuma tabela de preço</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
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
              <div key={table.id} className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                      <Tag className="h-4 w-4 text-cyan-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{table.name}</span>
                        {table.is_default && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                            <Star className="h-2.5 w-2.5" /> Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {table.type === "private" ? "Particular" : "Convênio"}
                        {insurancePlan ? ` · ${insurancePlan.name}` : ""}
                        {" · "}{servicePrices.length} serviços configurados
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={table.is_active ? "bg-emerald-100 text-emerald-700 text-[10px]" : "bg-slate-100 text-slate-500 text-[10px]"}>
                      {table.is_active ? "Ativa" : "Inativa"}
                    </Badge>
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
