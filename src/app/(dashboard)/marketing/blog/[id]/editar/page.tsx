"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2, Save, Eye, Tag } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditarPostPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const isNew = params.id === "novo"
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    status: "draft",
  })

  useEffect(() => {
    if (isNew) return
    async function load() {
      setLoading(true)
      const { data } = await supabase.from("blog_posts").select("*").eq("id", params.id as string).single()
      if (data) {
        setForm({
          title: (data.title as string) ?? "",
          slug: (data.slug as string) ?? "",
          excerpt: (data.excerpt as string) ?? "",
          content: (data.content as string) ?? "",
          tags: ((data.tags as string[] | null) ?? []).join(", "),
          meta_title: (data.meta_title as string) ?? "",
          meta_description: (data.meta_description as string) ?? "",
          status: (data.status as string) ?? "draft",
        })
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }

  async function save(publish?: boolean) {
    if (!form.title) { toast.error("O título é obrigatório"); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user?.id ?? "").single()
    if (!clinic) { setSaving(false); return }
    const { data: member } = await supabase.from("clinic_members").select("id").eq("user_id", user?.id ?? "").eq("clinic_id", clinic.id).single()

    const tagsArr = form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : null
    const payload = {
      clinic_id: clinic.id,
      author_id: member?.id ?? "",
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      tags: tagsArr,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      status: (publish ? "published" : form.status) as "draft" | "published" | "archived",
      published_at: publish ? new Date().toISOString() : null,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase.from("blog_posts") as any
    let error
    if (isNew) {
      ;({ error } = await db.insert(payload))
    } else {
      const { author_id: _a, ...updatePayload } = payload
      ;({ error } = await db.update(updatePayload).eq("id", params.id as string))
    }

    setSaving(false)
    if (error) { toast.error("Erro ao salvar", { description: error.message }); return }
    toast.success(publish ? "Post publicado!" : "Rascunho salvo!")
    router.push("/marketing/blog")
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/marketing/blog" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{isNew ? "Novo post" : "Editar post"}</h1>
            <p className="text-xs text-muted-foreground">Blog da clínica</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-1.5 border px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Salvar rascunho
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Publicar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-4">
            <div>
              <Label>Título <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1.5 text-lg font-semibold"
                placeholder="Ex: Como reduzir as faltas na sua clínica"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: f.slug || generateSlug(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Resumo (excerpt)</Label>
              <textarea
                className="mt-1.5 w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 resize-none"
                rows={2}
                placeholder="Um parágrafo resumindo o post..."
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <textarea
                className="mt-1.5 w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 resize-none font-mono"
                rows={16}
                placeholder="Escreva o conteúdo do post aqui (HTML ou Markdown)..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-4">
            <h3 className="font-semibold text-sm">SEO</h3>
            <div>
              <Label>Meta título</Label>
              <Input className="mt-1.5" placeholder={form.title || "Título para motores de busca"} value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))} />
            </div>
            <div>
              <Label>Meta descrição</Label>
              <textarea
                className="mt-1.5 w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 resize-none"
                rows={2}
                placeholder={form.excerpt || "Descrição para motores de busca (até 160 caracteres)"}
                value={form.meta_description}
                onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-4">
            <h3 className="font-semibold text-sm">Configurações</h3>
            <div>
              <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags (separadas por vírgula)</Label>
              <Input className="mt-1.5" placeholder="Gestão, Marketing..." value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input className="mt-1.5 font-mono text-xs" placeholder="meu-primeiro-post" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
