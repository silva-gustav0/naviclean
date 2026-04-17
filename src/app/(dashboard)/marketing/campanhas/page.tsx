import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Campanhas de Marketing</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">Comunicações automáticas e manuais</p>
        </div>
        <Link
          href="/marketing/campanhas/nova"
          className="surgical-gradient text-white text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Nova campanha
        </Link>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-emerald-200 rounded-2xl p-5 flex items-start gap-4 shadow-premium-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 20 }}>chat</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface">WhatsApp</p>
            <p className="text-sm text-on-surface-variant">Lembretes automáticos de consulta já ativos. Configure em Configurações → Notificações.</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-blue-200 rounded-2xl p-5 flex items-start gap-4 shadow-premium-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-600" style={{ fontSize: 20 }}>mail</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface">Email</p>
            <p className="text-sm text-on-surface-variant">Confirmações e lembretes por email via Resend. Configure em Configurações → Integrações.</p>
          </div>
        </div>
      </div>

      {/* Recent notifications */}
      {notifications && notifications.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <div className="px-5 py-4 border-b border-outline-variant bg-surface-container">
            <h2 className="font-semibold text-sm text-on-surface">Notificações enviadas recentemente</h2>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {notifications.map((n) => (
              <div key={n.id as string} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  n.channel === "whatsapp" ? "bg-emerald-50" : "bg-blue-50"
                }`}>
                  <span className={`material-symbols-outlined ${n.channel === "whatsapp" ? "text-emerald-600" : "text-blue-600"}`} style={{ fontSize: 16 }}>
                    {n.channel === "whatsapp" ? "chat" : "mail"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{n.title as string}</p>
                  <p className="text-xs text-on-surface-variant">{new Date(n.created_at as string).toLocaleString("pt-BR")}</p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${n.read_at ? "bg-surface-container text-on-surface-variant border-outline-variant" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                  {n.read_at ? "Lida" : "Nova"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>campaign</span>
          <h3 className="font-semibold text-on-surface text-base mb-1">Nenhuma comunicação ainda</h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-xs mx-auto">
            Crie campanhas de WhatsApp ou email para atrair e reativar pacientes.
          </p>
          <Link
            href="/marketing/campanhas/nova"
            className="inline-flex items-center gap-1.5 surgical-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Nova campanha
          </Link>
        </div>
      )}
    </div>
  )
}
