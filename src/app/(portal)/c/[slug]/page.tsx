import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, Phone, Mail, Clock, Star, Stethoscope, BadgeCheck } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: clinic } = await supabase
    .from("clinics")
    .select("name, description, meta_title, meta_description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!clinic) return { title: "Clínica não encontrada" }
  return {
    title: (clinic.meta_title as string) ?? (clinic.name as string),
    description: (clinic.meta_description as string) ?? (clinic.description as string) ?? undefined,
  }
}

export default async function ClinicProfilePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!clinic) notFound()

  const [{ data: members }, { data: services }, { data: reviews }] = await Promise.all([
    supabase
      .from("clinic_members")
      .select("id, full_name, role, specialty, cro, bio, profile_photo_url, procedures_performed, profiles(full_name, avatar_url)")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .in("role", ["dentist", "doctor", "independent_professional", "clinic_owner"]),
    supabase
      .from("services")
      .select("id, name, price, duration_minutes, category")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("reviews")
      .select("id, rating, comment, created_at")
      .eq("clinic_id", clinic.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : null

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] text-white">
        <div className="h-40 relative">
          {clinic.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={clinic.cover_image_url as string} alt="" className="w-full h-full object-cover opacity-30" />
          )}
        </div>
        <div className="px-6 pb-6 -mt-8 relative">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#0D3A6B] font-bold text-2xl shadow-lg shrink-0">
              {(clinic.name as string)[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{clinic.name as string}</h1>
              {clinic.description && <p className="text-blue-200 text-sm mt-0.5">{clinic.description as string}</p>}
            </div>
            {clinic.allow_online_booking && (
              <Link
                href={`/c/${slug}/agendar`}
                className="px-4 py-2 bg-white text-[#0D3A6B] rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shrink-0"
              >
                Agendar consulta
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-blue-200">
            {(clinic.address_city || clinic.address_state) && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {[clinic.address_street, clinic.address_city, clinic.address_state].filter(Boolean).join(", ")}
              </span>
            )}
            {clinic.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {clinic.phone as string}
              </span>
            )}
            {clinic.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {clinic.email as string}
              </span>
            )}
            {avgRating !== null && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {avgRating.toFixed(1)} ({reviews!.length} avaliações)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Team */}
          {(members ?? []).length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
              <h2 className="font-semibold mb-4">Nossa equipe</h2>
              <div className="space-y-4">
                {(members ?? []).map((m) => {
                  const profile = m.profiles as { full_name: string | null; avatar_url: string | null } | null
                  const name = (m.full_name ?? profile?.full_name) ?? "Profissional"
                  return (
                    <div key={m.id as string} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{name}</p>
                          {m.cro && <span className="flex items-center gap-1 text-xs text-muted-foreground"><BadgeCheck className="h-3 w-3" />{m.cro}</span>}
                        </div>
                        {m.specialty && <p className="text-xs text-muted-foreground">{m.specialty as string}</p>}
                        {m.bio && <p className="text-xs text-muted-foreground mt-1">{m.bio as string}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Services */}
          {(services ?? []).length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
              <h2 className="font-semibold mb-4">Serviços</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(services ?? []).map((s) => (
                  <div key={s.id as string} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-4 w-4 text-cyan-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{s.name as string}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {s.price && <span>{fmt(Number(s.price))}</span>}
                        {s.duration_minutes && <span><Clock className="h-3 w-3 inline mr-0.5" />{s.duration_minutes} min</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {(reviews ?? []).length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
              <h2 className="font-semibold mb-4">Avaliações</h2>
              <div className="space-y-3">
                {(reviews ?? []).map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {clinic.allow_online_booking && (
            <div className="bg-[#0D3A6B] rounded-2xl p-5 text-white text-center">
              <p className="font-semibold mb-3">Agende online agora</p>
              <p className="text-blue-200 text-xs mb-4">Escolha o horário que melhor funciona para você</p>
              <Link
                href={`/c/${slug}/agendar`}
                className="block w-full py-2.5 bg-white text-[#0D3A6B] rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors"
              >
                Ver horários disponíveis
              </Link>
            </div>
          )}

          {clinic.address_street && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4">
              <h3 className="font-semibold text-sm mb-2">Localização</h3>
              <p className="text-sm text-muted-foreground">
                {clinic.address_street as string}
                {clinic.address_number ? `, ${clinic.address_number as string}` : ""}
                {clinic.address_neighborhood ? ` - ${clinic.address_neighborhood as string}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {clinic.address_city as string}, {clinic.address_state as string}
                {clinic.address_zip ? ` - ${clinic.address_zip as string}` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
