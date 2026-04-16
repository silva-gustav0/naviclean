import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, Tag } from "lucide-react"

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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-[#0F172A] mb-3">Blog NaviClin</h1>
            <p className="text-slate-600 text-lg">Conteúdo prático sobre gestão, marketing e clínica para profissionais de saúde.</p>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b px-6 sticky top-[64px] bg-white z-10">
          <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === "Todos"
                    ? "bg-[#0D3A6B] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Posts */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id as string}
                    href={`/blog/${post.slug as string}`}
                    className="group border rounded-2xl overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="h-40 bg-gradient-to-br from-[#E8F0F9] to-[#DBB47A]/20 flex items-center justify-center">
                      <span className="text-5xl font-black text-[#0D3A6B]/10">{(post.title as string)?.[0]}</span>
                    </div>
                    <div className="p-5">
                      {(post.tags as string[] | null)?.[0] && (
                        <div className="flex items-center gap-1 mb-2">
                          <Tag className="h-3 w-3 text-[#DBB47A]" />
                          <span className="text-xs font-medium text-[#DBB47A]">{(post.tags as string[])[0]}</span>
                        </div>
                      )}
                      <h2 className="font-bold text-[#0F172A] mb-2 line-clamp-2 group-hover:text-[#0D3A6B] transition-colors">
                        {post.title as string}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{post.excerpt as string}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.published_at ? new Date(post.published_at as string).toLocaleDateString("pt-BR") : "—"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-2xl bg-[#E8F0F9] flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-10 w-10 text-[#0D3A6B]" />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">Em breve</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
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
