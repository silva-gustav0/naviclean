import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ClinicForm } from "@/components/dashboard/forms/clinic-form"

export default async function ClinicaConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("*").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Informações da Clínica</h1>
          <p className="text-on-surface-variant text-sm">Dados públicos da clínica</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 space-y-5 shadow-premium-sm">
        <div className="flex items-center gap-4 pb-5 border-b border-outline-variant">
          <div className="w-16 h-16 rounded-2xl surgical-gradient flex items-center justify-center text-white text-2xl font-bold shadow-premium-sm">
            {(clinic.name as string)?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg text-on-surface">{clinic.name as string}</p>
            <p className="text-sm text-on-surface-variant">naviclin.com/c/{clinic.slug as string}</p>
          </div>
        </div>

        <ClinicForm
          clinic={{
            name: clinic.name as string,
            slug: clinic.slug as string,
            phone: clinic.phone as string | null,
            address_city: clinic.address_city as string | null,
            address_state: clinic.address_state as string | null,
          }}
        />
      </div>
    </div>
  )
}
