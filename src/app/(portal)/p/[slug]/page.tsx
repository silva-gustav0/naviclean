import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: member } = await supabase
    .from("clinic_members")
    .select("full_name, specialty")
    .eq("id", slug)
    .eq("is_active", true)
    .single()

  if (!member) return { title: "Profissional não encontrado" }
  return {
    title: `${member.full_name as string} — NaviClin`,
    description: `Agende com ${member.full_name as string}, ${member.specialty as string ?? "profissional de saúde"}.`,
  }
}

export default async function ProfissionalPublicoPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: member } = await supabase
    .from("clinic_members")
    .select("*, clinics(id, name, slug, address_street, address_city, address_state), profiles(full_name, avatar_url)")
    .eq("id", slug)
    .eq("is_active", true)
    .single()

  if (!member) notFound()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, comment, created_at, patients(full_name)")
    .eq("member_id", member.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(5)

  const clinic = member.clinics as { id: string; name: string; slug: string; address_street?: string; address_city?: string; address_state?: string } | null

  const { data: services } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .eq("clinic_id", clinic?.id ?? "")
    .eq("is_active", true)
    .limit(10)

  const name = (member.full_name ?? (member.profiles as { full_name?: string } | null)?.full_name) ?? "Profissional"
  const initials = name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
  const avgRating = reviews?.length ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length : 0

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-premium-sm">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl surgical-gradient flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="font-headline font-extrabold text-2xl text-primary">{name}</h1>
                {member.specialty && (
                  <p className="text-on-surface-variant mt-0.5">{member.specialty as string}</p>
                )}
                {member.cro && (
                  <p className="flex items-center gap-1 text-sm text-on-surface-variant mt-1">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>verified</span>
                    CRO: {member.cro as string}
                  </p>
                )}
              </div>
              {clinic && (
                <Link
                  href={`/c/${clinic.slug}/agendar`}
                  className="flex items-center gap-2 bg-nc-secondary hover:opacity-90 text-primary font-bold px-5 py-2.5 rounded-xl transition-opacity text-sm shadow-premium-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_month</span>
                  Agendar consulta
                </Link>
              )}
            </div>
            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`material-symbols-outlined ${i < Math.round(avgRating) ? "text-nc-secondary" : "text-outline"}`}
                      style={{ fontSize: 16, fontVariationSettings: i < Math.round(avgRating) ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-on-surface">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-on-surface-variant">({reviews.length} avaliações)</span>
              </div>
            )}
          </div>
        </div>

        {clinic && (
          <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: 16 }}>location_on</span>
            <Link href={`/c/${clinic.slug}`} className="hover:text-primary hover:underline transition-colors">
              {clinic.name}
              {clinic.address_city && ` · ${clinic.address_city}/${clinic.address_state}`}
            </Link>
          </div>
        )}
      </div>

      {member.bio && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
          <h2 className="font-headline font-bold text-on-surface mb-2">Sobre</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">{member.bio as string}</p>
        </div>
      )}

      {member.procedures_performed && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
          <h2 className="font-headline font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>medical_services</span>
            Procedimentos
          </h2>
          <div className="flex flex-wrap gap-2">
            {(member.procedures_performed as string[]).map((p) => (
              <span key={p} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">{p}</span>
            ))}
          </div>
        </div>
      )}

      {services && services.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
          <h2 className="font-headline font-bold text-on-surface mb-3">Serviços disponíveis</h2>
          <div className="divide-y divide-outline-variant/50">
            {services.map((s) => (
              <div key={s.id as string} className="flex items-center justify-between py-2.5">
                <p className="text-sm font-medium text-on-surface">{s.name as string}</p>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  {s.duration_minutes && <span>{s.duration_minutes} min</span>}
                  {s.price && <span className="font-semibold text-primary">{Number(s.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
          <h2 className="font-headline font-bold text-on-surface mb-3">Avaliações dos pacientes</h2>
          <div className="space-y-3">
            {reviews.map((r, i) => {
              const pat = r.patients as { full_name: string } | null
              return (
                <div key={i} className="pb-3 border-b border-outline-variant/50 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-on-surface">{pat?.full_name ?? "Paciente"}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span
                          key={j}
                          className={`material-symbols-outlined ${j < Number(r.rating) ? "text-nc-secondary" : "text-outline"}`}
                          style={{ fontSize: 14, fontVariationSettings: j < Number(r.rating) ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-on-surface-variant">{r.comment as string}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {clinic && (
        <div className="sticky bottom-4">
          <Link
            href={`/c/${clinic.slug}/agendar`}
            className="flex items-center justify-center gap-2 bg-nc-secondary hover:opacity-90 text-primary font-bold py-4 rounded-2xl shadow-premium transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>calendar_month</span>
            Agendar com {name.split(" ")[0]}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </Link>
        </div>
      )}
    </div>
  )
}
