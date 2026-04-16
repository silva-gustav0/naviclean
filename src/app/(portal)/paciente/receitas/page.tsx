import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FileText, Download } from "lucide-react"

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

  const today = new Date()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Minhas Receitas</h1>

      {prescriptions && prescriptions.length > 0 ? (
        <div className="space-y-3">
          {prescriptions.map((p) => {
            const member = p.clinic_members as { full_name: string } | null
            const typeLabel: Record<string, string> = { recipe: "Receita", certificate: "Atestado", referral: "Encaminhamento" }

            return (
              <div key={p.id as string} className="bg-white dark:bg-slate-900 border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-violet-50">
                      <FileText className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.title as string}</p>
                      <p className="text-xs text-muted-foreground">
                        Dr(a). {member?.full_name ?? "—"} · {typeLabel[p.type as string] ?? p.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.created_at as string).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  {p.pdf_url && (
                    <a
                      href={p.pdf_url as string}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-xl hover:border-[#0D3A6B] hover:text-[#0D3A6B] transition-colors shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
            <FileText className="h-7 w-7 text-violet-600" />
          </div>
          <p className="font-semibold">Nenhuma receita</p>
          <p className="text-muted-foreground text-sm mt-1">Suas receitas médicas aparecerão aqui.</p>
        </div>
      )}
    </div>
  )
}
