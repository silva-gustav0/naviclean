import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naviclin.com.br"

  const supabase = await createClient()
  const { data: clinics } = await supabase
    .from("clinics")
    .select("slug, updated_at")
    .eq("is_active", true)
    .not("slug", "is", null)

  const clinicUrls: MetadataRoute.Sitemap = (clinics ?? []).map((clinic) => ({
    url: `${baseUrl}/c/${clinic.slug}`,
    lastModified: clinic.updated_at ? new Date(clinic.updated_at as string) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...clinicUrls,
  ]
}
