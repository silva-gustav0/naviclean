import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CopyLinkButton } from "@/components/dashboard/copy-link-button"
import Link from "next/link"

const channels = [
  { icon: "chat", label: "WhatsApp", desc: "Notificações automáticas", href: "/marketing/campanhas" },
  { icon: "mail", label: "Email", desc: "Campanhas e confirmações", href: "/marketing/campanhas" },
  { icon: "article", label: "Blog", desc: "Conteúdo para pacientes", href: "/marketing/blog" },
  { icon: "share", label: "Link de agendamento", desc: "Compartilhe online", href: "/marketing/leads" },
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
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Marketing</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans">Atraia e retenha mais pacientes</p>
        </div>
        <Link
          href="/marketing/blog/new"
          className="surgical-gradient text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-premium-sm hover:opacity-90 transition-all flex items-center gap-2 font-headline"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Novo Post
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {channels.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-4 flex flex-col gap-3 hover:border-nc-secondary/30 hover:shadow-premium-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-nc-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {c.icon}
              </span>
            </div>
            <div>
              <p className="font-headline font-semibold text-sm text-primary">{c.label}</p>
              <p className="text-xs text-on-surface-variant font-sans">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Link de agendamento */}
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 shadow-premium-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-nc-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
          </div>
          <div>
            <p className="font-headline font-semibold text-sm text-primary">Seu link de agendamento</p>
            <p className="text-xs text-on-surface-variant font-sans">Compartilhe para receber agendamentos online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-2.5 text-sm text-on-surface-variant font-sans truncate">
            naviclin.com/c/{clinic.slug as string}
          </div>
          <CopyLinkButton slug={clinic.slug as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blog posts */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-premium-sm">
          <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="font-headline font-semibold text-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>article</span>
              Posts do Blog
            </h3>
          </div>
          {posts && posts.length > 0 ? (
            <div className="divide-y divide-outline-variant/10">
              {posts.map((p) => (
                <div key={p.id as string} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary truncate font-headline">{p.title as string}</p>
                    <p className="text-xs text-on-surface-variant font-sans">{new Date(p.created_at as string).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold font-sans ${
                    p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-surface-container-low text-outline"
                  }`}>
                    {p.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center px-5">
              <span className="material-symbols-outlined text-outline text-4xl block mx-auto mb-2">article</span>
              <p className="text-sm font-semibold text-primary font-headline">Nenhum post ainda</p>
              <p className="text-xs text-on-surface-variant mt-1 font-sans">Crie conteúdo para atrair pacientes</p>
            </div>
          )}
        </div>

        {/* Leads */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-premium-sm">
          <div className="px-5 py-4 border-b border-outline-variant/10">
            <h3 className="font-headline font-semibold text-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
              Leads Recentes
            </h3>
          </div>
          {leads && leads.length > 0 ? (
            <div className="divide-y divide-outline-variant/10">
              {leads.map((l) => (
                <div key={l.id as string} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
                  <div className="w-8 h-8 rounded-full bg-nc-secondary/10 flex items-center justify-center text-nc-secondary text-xs font-bold shrink-0 font-headline">
                    {(l.name as string)?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary truncate font-headline">{l.name as string}</p>
                    <p className="text-xs text-on-surface-variant truncate font-sans">{l.email as string}</p>
                  </div>
                  {l.phone && (
                    <a href={`tel:${(l.phone as string).replace(/\D/g, "")}`} className="p-1.5 hover:bg-surface-container-low rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-outline text-xl">phone</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center px-5">
              <span className="material-symbols-outlined text-outline text-4xl block mx-auto mb-2">person_search</span>
              <p className="text-sm font-semibold text-primary font-headline">Nenhum lead ainda</p>
              <p className="text-xs text-on-surface-variant mt-1 font-sans">Leads do formulário de contato aparecerão aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
