import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FileText, Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog da Clínica</h1>
          <p className="text-muted-foreground text-sm">{posts?.length ?? 0} post{(posts?.length ?? 0) !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/marketing/blog/novo/editar"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo post
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Título</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Tags</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Data</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 font-medium max-w-xs truncate">{post.title as string}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{(post.tags as string[] | null)?.[0] || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] ${
                      post.status === "published" ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                    }`}>
                      {post.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date((post.published_at ?? post.created_at) as string).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {post.status === "published" && (
                        <a
                          href={`/c/${clinic.slug as string}/blog/${post.slug as string}`}
                          target="_blank"
                          rel="noopener"
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </a>
                      )}
                      <Link
                        href={`/marketing/blog/${post.id as string}/editar`}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="font-semibold text-base mb-1">Nenhum post ainda</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Crie conteúdo para atrair novos pacientes e fortalecer a presença online da sua clínica.
          </p>
          <Link
            href="/marketing/blog/novo/editar"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Criar primeiro post
          </Link>
        </div>
      )}
    </div>
  )
}
