import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naviclin.com.br"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/buscar", "/c/"],
        disallow: [
          "/dashboard",
          "/agenda",
          "/pacientes",
          "/financeiro",
          "/equipe",
          "/tratamentos",
          "/marketing",
          "/estoque",
          "/configuracoes",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
