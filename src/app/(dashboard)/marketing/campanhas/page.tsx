import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Megaphone, Plus, MessageSquare, Mail } from "lucide-react"
import Link from "next/link"

export default async function CampanhasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, channel, title, created_at, read_at")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campanhas de Marketing</h1>
          <p className="text-muted-foreground text-sm">Comunicações automáticas e manuais</p>
        </div>
        <Link
          href="/marketing/campanhas/nova"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova campanha
        </Link>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold">WhatsApp</p>
            <p className="text-sm text-muted-foreground">Lembretes automáticos de consulta já ativos. Configure em Configurações → Notificações.</p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-sm text-muted-foreground">Confirmações e lembretes por email via Resend. Configure em Configurações → Integrações.</p>
          </div>
        </div>
      </div>

      {/* Recent notifications */}
      {notifications && notifications.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold text-sm">Notificações enviadas recentemente</h2>
          </div>
          <div className="divide-y">
            {notifications.map((n) => (
              <div key={n.id as string} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  n.channel === "whatsapp" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                }`}>
                  {n.channel === "whatsapp" ? <MessageSquare className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title as string}</p>
                  <p className="text-xs text-muted-foreground">{new Date(n.created_at as string).toLocaleString("pt-BR")}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${n.read_at ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-700"}`}>
                  {n.read_at ? "Lida" : "Nova"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center mx-auto mb-4">
            <Megaphone className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="font-semibold text-base mb-1">Nenhuma comunicação ainda</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Crie campanhas de WhatsApp ou email para atrair e reativar pacientes.
          </p>
          <Link
            href="/marketing/campanhas/nova"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova campanha
          </Link>
        </div>
      )}
    </div>
  )
}
