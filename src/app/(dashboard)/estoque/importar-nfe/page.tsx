import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { NfeImportClient } from "@/components/dashboard/estoque/NfeImportClient"

export default async function ImportarNfePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: existingItems } = await supabase
    .from("stock_items")
    .select("id, name, unit, category")
    .eq("clinic_id", clinic.id)
    .eq("is_active", true)
    .order("name")

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-1">
          <Link href="/estoque" className="hover:text-on-surface transition-colors">Estoque</Link>
          <span>/</span>
          <span>Importar NF-e</span>
        </div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Importar NF-e</h1>
        <p className="text-on-surface-variant text-sm">Faça o upload do XML da nota fiscal para importar itens automaticamente</p>
      </div>

      <NfeImportClient
        clinicId={clinic.id}
        existingItems={(existingItems ?? []).map((i) => ({
          id: i.id,
          name: i.name,
          unit: i.unit,
          category: i.category as string | null,
        }))}
      />
    </div>
  )
}
