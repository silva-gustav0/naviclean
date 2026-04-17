import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined ${i < rating ? "text-nc-secondary" : "text-outline"}`}
          style={{ fontSize: 14, fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
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
        <h1 className="font-headline font-extrabold text-3xl text-primary">Avaliações dos Pacientes</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">{reviews?.length ?? 0} avaliações recebidas</p>
      </div>

      {/* Summary card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-premium-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="font-headline font-extrabold text-5xl text-primary">{avg.toFixed(1)}</p>
            <div className="flex justify-center mt-2">
              <StarRating rating={Math.round(avg)} />
            </div>
            <p className="text-xs text-on-surface-variant mt-1">{reviews?.length ?? 0} avaliações</p>
          </div>
          <div className="md:col-span-2 space-y-2">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="text-xs w-4 text-right text-on-surface-variant">{d.star}</span>
                <span className="material-symbols-outlined text-nc-secondary shrink-0" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>star</span>
                <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-nc-secondary rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs text-on-surface-variant w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((r) => {
            const patient = r.patients as { full_name: string } | null
            return (
              <div key={r.id as string} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full surgical-gradient flex items-center justify-center font-bold text-sm text-white shrink-0">
                      {(patient?.full_name ?? "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{patient?.full_name ?? "Paciente anônimo"}</p>
                      <p className="text-xs text-on-surface-variant">{new Date(r.created_at as string).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <StarRating rating={Number(r.rating)} />
                </div>
                {r.comment && <p className="text-sm text-on-surface-variant">{r.comment as string}</p>}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>rate_review</span>
          <p className="font-semibold text-on-surface">Nenhuma avaliação ainda</p>
          <p className="text-on-surface-variant text-sm mt-1">Avaliações dos pacientes após consultas aparecerão aqui.</p>
        </div>
      )}
    </div>
  )
}
