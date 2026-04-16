import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, Star, BadgeCheck, Calendar, ChevronRight, Stethoscope } from "lucide-react"
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
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">{name}</h1>
                {member.specialty && (
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{member.specialty as string}</p>
                )}
                {member.cro && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <BadgeCheck className="h-4 w-4 text-blue-600" />
                    CRO: {member.cro as string}
                  </p>
                )}
              </div>
              {clinic && (
                <Link
                  href={`/c/${clinic.slug}/agendar`}
                  className="flex items-center gap-2 bg-[#DBB47A] hover:bg-[#C89958] text-[#0D3A6B] font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar consulta
                </Link>
              )}
            </div>
            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({reviews.length} avaliações)</span>
              </div>
            )}
          </div>
        </div>

        {clinic && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <Link href={`/c/${clinic.slug}`} className="hover:text-[#0D3A6B] hover:underline transition-colors">
              {clinic.name}
              {clinic.address_city && ` · ${clinic.address_city}/${clinic.address_state}`}
            </Link>
          </div>
        )}
      </div>

      {/* Bio */}
      {member.bio && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
          <h2 className="font-semibold mb-2">Sobre</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{member.bio as string}</p>
        </div>
      )}

      {/* Procedimentos */}
      {member.procedures_performed && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-[#0D3A6B]" />
            Procedimentos
          </h2>
          <div className="flex flex-wrap gap-2">
            {(member.procedures_performed as string[]).map((p) => (
              <span key={p} className="px-3 py-1 bg-[#E8F0F9] text-[#0D3A6B] text-xs font-medium rounded-full">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Serviços */}
      {services && services.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
          <h2 className="font-semibold mb-3">Serviços disponíveis</h2>
          <div className="divide-y">
            {services.map((s) => (
              <div key={s.id as string} className="flex items-center justify-between py-2.5">
                <p className="text-sm font-medium">{s.name as string}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {s.duration_minutes && <span>{s.duration_minutes} min</span>}
                  {s.price && <span className="font-semibold text-[#0D3A6B]">{Number(s.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avaliações */}
      {reviews && reviews.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
          <h2 className="font-semibold mb-3">Avaliações dos pacientes</h2>
          <div className="space-y-3">
            {reviews.map((r, i) => {
              const pat = r.patients as { full_name: string } | null
              return (
                <div key={i} className="pb-3 border-b last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{pat?.full_name ?? "Paciente"}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3.5 w-3.5 ${j < Number(r.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-slate-500">{r.comment as string}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CTA Sticky */}
      {clinic && (
        <div className="sticky bottom-4">
          <Link
            href={`/c/${clinic.slug}/agendar`}
            className="flex items-center justify-center gap-2 bg-[#DBB47A] hover:bg-[#C89958] text-[#0D3A6B] font-bold py-4 rounded-2xl shadow-lg transition-colors"
          >
            <Calendar className="h-5 w-5" />
            Agendar com {name.split(" ")[0]}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
