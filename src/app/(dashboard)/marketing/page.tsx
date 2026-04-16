import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Megaphone, Plus, Users, FileText, Link as LinkIcon, Mail, MessageSquare } from "lucide-react"
import { CopyLinkButton } from "@/components/dashboard/copy-link-button"

const channels = [
  { icon: MessageSquare, label: "WhatsApp", desc: "Notificações automáticas", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
  { icon: Mail, label: "Email", desc: "Campanhas e confirmações", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
  { icon: FileText, label: "Blog", desc: "Conteúdo para pacientes", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
  { icon: LinkIcon, label: "Link de agendamento", desc: "Compartilhe online", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950" },
]

export default async function MarketingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id, slug").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, status, created_at")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing</h1>
          <p className="text-muted-foreground text-sm">Atraia e retenha mais pacientes</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="h-4 w-4" />
          Novo Post
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {channels.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 flex flex-col gap-3 cursor-pointer group hover:shadow-sm transition-all`}>
            <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center">
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <div>
              <p className="font-semibold text-sm">{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Link de agendamento */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border border-orange-100 dark:border-orange-900 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <LinkIcon className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Seu link de agendamento</p>
            <p className="text-xs text-muted-foreground">Compartilhe para receber agendamentos online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-muted-foreground font-mono truncate">
            naviclin.com/c/{clinic.slug as string}
          </div>
          <CopyLinkButton slug={clinic.slug as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blog posts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-violet-600" />
              Posts do Blog
            </h2>
          </div>
          {posts && posts.length > 0 ? (
            <div className="divide-y">
              {posts.map((p) => (
                <div key={p.id as string} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.title as string}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.created_at as string).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {p.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center px-5">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Nenhum post ainda</p>
              <p className="text-xs text-muted-foreground mt-1">Crie conteúdo para atrair pacientes</p>
            </div>
          )}
        </div>

        {/* Leads */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              Leads Recentes
            </h2>
          </div>
          {leads && leads.length > 0 ? (
            <div className="divide-y">
              {leads.map((l) => (
                <div key={l.id as string} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 text-xs font-semibold shrink-0">
                    {(l.name as string)?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{l.name as string}</p>
                    <p className="text-xs text-muted-foreground truncate">{l.email as string}</p>
                  </div>
                  {l.phone && (
                    <a href={`tel:${(l.phone as string).replace(/\D/g, "")}`} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                      <Megaphone className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center px-5">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Nenhum lead ainda</p>
              <p className="text-xs text-muted-foreground mt-1">Leads do formulário de contato aparecerão aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
