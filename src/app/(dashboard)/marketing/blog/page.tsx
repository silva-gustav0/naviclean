import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function MarketingBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id, slug").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, tags, created_at, published_at")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Blog da Clínica</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">{posts?.length ?? 0} post{(posts?.length ?? 0) !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/marketing/blog/novo/editar"
          className="surgical-gradient text-white text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Novo post
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left text-xs font-medium text-on-surface-variant px-5 py-3">Título</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Tags</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Data</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {posts.map((post) => (
                <tr key={post.id as string} className="hover:bg-surface-container transition-colors">
                  <td className="px-5 py-3 font-semibold text-on-surface max-w-xs truncate">{post.title as string}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{(post.tags as string[] | null)?.[0] || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-surface-container text-on-surface-variant border-outline-variant"
                    }`}>
                      {post.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">
                    {new Date((post.published_at ?? post.created_at) as string).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {post.status === "published" && (
                        <a
                          href={`/c/${clinic.slug as string}/blog/${post.slug as string}`}
                          target="_blank"
                          rel="noopener"
                          className="p-1.5 hover:bg-surface-container rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>open_in_new</span>
                        </a>
                      )}
                      <Link
                        href={`/marketing/blog/${post.id as string}/editar`}
                        className="p-1.5 hover:bg-surface-container rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>edit</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>article</span>
          <h3 className="font-semibold text-on-surface text-base mb-1">Nenhum post ainda</h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-xs mx-auto">
            Crie conteúdo para atrair novos pacientes e fortalecer a presença online da sua clínica.
          </p>
          <Link
            href="/marketing/blog/novo/editar"
            className="inline-flex items-center gap-1.5 surgical-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Criar primeiro post
          </Link>
        </div>
      )}
    </div>
  )
}
