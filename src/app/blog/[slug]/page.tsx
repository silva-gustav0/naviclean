import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"

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
        <section className="bg-primary/5 border-b border-primary/10 py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Voltar para o blog
            </Link>
            {(post.tags as string[] | null)?.[0] && (
              <div className="flex items-center gap-1 mb-3">
                <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 14 }}>label</span>
                <span className="text-sm font-medium text-nc-secondary">{(post.tags as string[])[0]}</span>
              </div>
            )}
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-primary mb-4 leading-tight">
              {post.title as string}
            </h1>
            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                  {new Date(post.published_at as string).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="py-10 px-6">
          <div className="max-w-3xl mx-auto">
            {post.content ? (
              <div
                className="prose prose-slate prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content as string }}
              />
            ) : (
              <p className="text-on-surface-variant italic">Conteúdo em breve.</p>
            )}
          </div>
        </section>

        {related && related.length > 0 && (
          <section className="py-12 px-6 bg-surface-container-low border-t border-outline-variant">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-headline font-bold text-lg text-on-surface mb-6">Posts relacionados</h2>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id as string}
                    href={`/blog/${r.slug as string}`}
                    className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary/30 hover:shadow-premium-sm transition-all group"
                  >
                    <div>
                      <p className="font-medium text-sm text-on-surface group-hover:text-primary transition-colors">{r.title as string}</p>
                      {r.published_at && (
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {new Date(r.published_at as string).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary shrink-0" style={{ fontSize: 18 }}>chevron_right</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="surgical-gradient py-14 px-6">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="font-headline font-extrabold text-2xl mb-3">Experimente o NaviClin grátis</h2>
            <p className="text-white/70 mb-6 text-sm">14 dias sem compromisso. Sem cartão de crédito.</p>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-nc-secondary hover:opacity-90 text-primary font-bold px-6 py-3 rounded-xl transition-opacity shadow-premium"
            >
              Começar agora
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
