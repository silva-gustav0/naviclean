import { createClient } from "@/lib/supabase/server"
import { SearchClient } from "@/components/portal/SearchClient"

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lat?: string; lng?: string }>
}) {
  const { q, lat, lng } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("clinics")
    .select("id, name, slug, description, logo_url, cover_image_url, address_city, address_state, address_street, phone, latitude, longitude, allow_online_booking")
    .eq("is_active", true)
    .eq("allow_online_booking", true)
    .limit(20)

  if (q) {
    query = query.ilike("name", `%${q}%`)
  }

  const { data: clinics } = await query

  // Calculate distances if coordinates provided
  const userLat = lat ? parseFloat(lat) : null
  const userLng = lng ? parseFloat(lng) : null

  const enriched = (clinics ?? []).map((clinic) => {
    let distance: number | null = null
    if (userLat && userLng && clinic.latitude && clinic.longitude) {
      // Haversine formula
      const R = 6371 // km
      const dLat = ((clinic.latitude - userLat) * Math.PI) / 180
      const dLng = ((clinic.longitude - userLng) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLat * Math.PI) / 180) *
          Math.cos((clinic.latitude * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2)
      distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }
    return { ...clinic, distance }
  }).sort((a, b) => {
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance
    if (a.distance !== null) return -1
    if (b.distance !== null) return 1
    return 0
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-primary mb-1">Encontrar clínica</h1>
        <p className="text-on-surface-variant text-sm">Busque por nome, especialidade ou localização</p>
      </div>

      <SearchClient clinics={enriched} initialQuery={q ?? ""} />
    </div>
  )
}
