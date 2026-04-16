"use client"

import { useState } from "react"
import { Search, MapPin, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Clinic {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  address_city: string | null
  address_state: string | null
  address_street: string | null
  phone: string | null
  distance: number | null
  allow_online_booking: boolean | null
}

interface Props {
  clinics: Clinic[]
  initialQuery: string
}

export function SearchClient({ clinics, initialQuery }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/buscar?q=${encodeURIComponent(query)}`)
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        router.push(`/buscar?q=${encodeURIComponent(query)}&lat=${latitude}&lng=${longitude}`)
        setLoading(false)
      },
      () => {
        setLoading(false)
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome da clínica, especialidade..."
            className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2.5 border rounded-xl text-sm hover:bg-slate-50 transition-colors"
        >
          <MapPin className="h-4 w-4" />
          {loading ? "..." : "Perto de mim"}
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#0D3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#1A5599] transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Results */}
      {clinics.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Nenhuma clínica encontrada</h3>
          <p className="text-muted-foreground text-sm">Tente outros termos de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Cover */}
              <div className="h-28 bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] relative">
                {clinic.logo_url && (
                  <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={clinic.logo_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold">{clinic.name}</h3>
                  {clinic.distance !== null && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {clinic.distance < 1
                        ? `${Math.round(clinic.distance * 1000)} m`
                        : `${clinic.distance.toFixed(1)} km`}
                    </span>
                  )}
                </div>
                {clinic.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{clinic.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  {(clinic.address_city || clinic.address_state) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {[clinic.address_city, clinic.address_state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {clinic.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {clinic.phone}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/c/${clinic.slug}`}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver perfil
                  </Link>
                  {clinic.allow_online_booking && (
                    <Link
                      href={`/c/${clinic.slug}/agendar`}
                      className="text-xs px-3 py-1.5 bg-[#0D3A6B] text-white rounded-lg hover:bg-[#1A5599] transition-colors font-medium"
                    >
                      Agendar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
