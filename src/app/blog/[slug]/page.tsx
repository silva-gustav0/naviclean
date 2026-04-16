import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, ArrowLeft, Tag, ChevronRight } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .is("clinic_id", null)
    .single()

  if (!post) return { title: "Post não encontrado — NaviClin" }
  return {
    title: `${post.title as string} — NaviClin Blog`,
    description: post.excerpt as string ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("clinic_id", null)
    .single()

  if (!post) notFound()

  const { data: related } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published_at, tags")
    .eq("status", "published")
    .is("clinic_id", null)
    .neq("slug", slug)
    .limit(3)
    .order("published_at", { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0D3A6B] transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o blog
            </Link>
            {(post.tags as string[] | null)?.[0] && (
              <div className="flex items-center gap-1 mb-3">
                <Tag className="h-3.5 w-3.5 text-[#DBB47A]" />
                <span className="text-sm font-medium text-[#DBB47A]">{(post.tags as string[])[0]}</span>
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4 leading-tight">
              {post.title as string}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.published_at as string).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 px-6">
          <div className="max-w-3xl mx-auto">
            {post.content ? (
              <div
                className="prose prose-slate prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content as string }}
              />
            ) : (
              <p className="text-slate-500 italic">Conteúdo em breve.</p>
            )}
          </div>
        </section>

        {/* Related */}
        {related && related.length > 0 && (
          <section className="py-12 px-6 bg-[#F7F9FC] border-t">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-bold mb-6">Posts relacionados</h2>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id as string}
                    href={`/blog/${r.slug as string}`}
                    className="flex items-center justify-between p-4 bg-white border rounded-xl hover:border-[#0D3A6B]/30 hover:shadow-sm transition-all group"
                  >
                    <div>
                      <p className="font-medium text-sm group-hover:text-[#0D3A6B] transition-colors">{r.title as string}</p>
                      {r.published_at && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(r.published_at as string).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0D3A6B] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-[#0D3A6B] py-14 px-6">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Experimente o NaviClin grátis</h2>
            <p className="text-blue-200 mb-6 text-sm">14 dias sem compromisso. Sem cartão de crédito.</p>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-[#DBB47A] hover:bg-[#C89958] text-[#0D3A6B] font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Começar agora
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
