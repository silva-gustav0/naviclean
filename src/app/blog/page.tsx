import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog — NaviClin",
  description: "Artigos sobre gestão de clínicas odontológicas e médicas, marketing para dentistas, financeiro e muito mais.",
}

const categories = ["Todos", "Gestão", "Marketing", "Clínico", "Financeiro", "Tecnologia"]

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, tags, published_at")
    .eq("status", "published")
    .is("clinic_id", null)
    .order("published_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        <section className="bg-primary/5 border-b border-primary/10 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-headline font-extrabold text-4xl text-primary mb-3">Blog NaviClin</h1>
            <p className="text-on-surface-variant text-lg">Conteúdo prático sobre gestão, marketing e clínica para profissionais de saúde.</p>
          </div>
        </section>

        <section className="border-b border-outline-variant px-6 sticky top-[64px] bg-surface z-10">
          <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === "Todos"
                    ? "surgical-gradient text-white shadow-premium-sm"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id as string}
                    href={`/blog/${post.slug as string}`}
                    className="group border border-outline-variant rounded-2xl overflow-hidden hover:shadow-premium-sm transition-all bg-surface-container-lowest"
                  >
                    <div className="h-40 bg-primary/5 flex items-center justify-center">
                      <span className="text-5xl font-black text-primary/10">{(post.title as string)?.[0]}</span>
                    </div>
                    <div className="p-5">
                      {(post.tags as string[] | null)?.[0] && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 12 }}>label</span>
                          <span className="text-xs font-medium text-nc-secondary">{(post.tags as string[])[0]}</span>
                        </div>
                      )}
                      <h2 className="font-semibold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title as string}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">{post.excerpt as string}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>calendar_today</span>
                          {post.published_at ? new Date(post.published_at as string).toLocaleDateString("pt-BR") : "—"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 40 }}>article</span>
                </div>
                <h2 className="font-headline font-bold text-xl text-primary mb-2">Em breve</h2>
                <p className="text-on-surface-variant max-w-sm mx-auto">
                  Estamos preparando conteúdo rico sobre gestão clínica para você. Volte em breve!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
