import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Star, MessageSquare } from "lucide-react"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
      ))}
    </div>
  )
}

export default async function AvaliacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, patient_id, patients(full_name)")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(50)

  const avg = reviews && reviews.length > 0
    ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
    : 0

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: (reviews ?? []).filter((r) => Number(r.rating) === star).length,
    pct: reviews?.length ? (((reviews ?? []).filter((r) => Number(r.rating) === star).length) / reviews.length) * 100 : 0,
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Avaliações dos Pacientes</h1>
        <p className="text-muted-foreground text-sm">{reviews?.length ?? 0} avaliações recebidas</p>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-5xl font-black text-[#0D3A6B]">{avg.toFixed(1)}</p>
            <StarRating rating={Math.round(avg)} />
            <p className="text-xs text-muted-foreground mt-1">{reviews?.length ?? 0} avaliações</p>
          </div>
          <div className="md:col-span-2 space-y-2">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="text-xs w-4 text-right">{d.star}</span>
                <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((r) => {
            const patient = r.patients as { full_name: string } | null
            return (
              <div key={r.id as string} className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E8F0F9] flex items-center justify-center font-bold text-sm text-[#0D3A6B] shrink-0">
                      {(patient?.full_name ?? "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{patient?.full_name ?? "Paciente anônimo"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.created_at as string).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <StarRating rating={Number(r.rating)} />
                </div>
                {r.comment && <p className="text-sm text-slate-600 dark:text-slate-300">{r.comment as string}</p>}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="h-7 w-7 text-amber-500" />
          </div>
          <p className="font-semibold">Nenhuma avaliação ainda</p>
          <p className="text-muted-foreground text-sm mt-1">Avaliações dos pacientes após consultas aparecerão aqui.</p>
        </div>
      )}
    </div>
  )
}
