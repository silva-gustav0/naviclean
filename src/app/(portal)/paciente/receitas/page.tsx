import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PacienteReceitasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/paciente/login")

  const { data: patient } = await supabase.from("patients").select("id").eq("user_id", user.id).single()
  const patientId = patient?.id ?? ""

  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("id, created_at, title, type, content, pdf_url, clinic_members(full_name)")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })

  const typeLabel: Record<string, string> = { recipe: "Receita", certificate: "Atestado", referral: "Encaminhamento" }

  return (
    <div className="space-y-6">
      <h1 className="font-headline font-extrabold text-2xl text-primary">Minhas Receitas</h1>

      {prescriptions && prescriptions.length > 0 ? (
        <div className="space-y-3">
          {prescriptions.map((p) => {
            const member = p.clinic_members as { full_name: string } | null
            return (
              <div key={p.id as string} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-premium-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-violet-50">
                      <span className="material-symbols-outlined text-violet-600" style={{ fontSize: 20 }}>description</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{p.title as string}</p>
                      <p className="text-xs text-on-surface-variant">
                        Dr(a). {member?.full_name ?? "—"} · {typeLabel[p.type as string] ?? p.type}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(p.created_at as string).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  {p.pdf_url && (
                    <a
                      href={p.pdf_url as string}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1.5 text-xs font-medium border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-xl hover:border-primary hover:text-primary transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
                      PDF
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>description</span>
          <p className="font-semibold text-on-surface">Nenhuma receita</p>
          <p className="text-on-surface-variant text-sm mt-1">Suas receitas médicas aparecerão aqui.</p>
        </div>
      )}
    </div>
  )
}
