import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const integrations = [
  {
    key: "whatsapp",
    icon: "chat",
    iconCls: "bg-emerald-50 text-emerald-600",
    name: "WhatsApp Business",
    desc: "Envio automático de confirmações, lembretes e pós-consulta.",
    settingKey: "whatsapp_enabled",
    href: "https://business.whatsapp.com",
  },
  {
    key: "stripe",
    icon: "credit_card",
    iconCls: "bg-violet-50 text-violet-600",
    name: "Stripe",
    desc: "Cobrança online, link de pagamento e portal do cliente.",
    settingKey: "stripe_enabled",
    href: "https://dashboard.stripe.com",
  },
  {
    key: "google_calendar",
    icon: "calendar_month",
    iconCls: "bg-blue-50 text-blue-600",
    name: "Google Calendar",
    desc: "Sincronize a agenda com o Google Calendar dos profissionais.",
    settingKey: "google_calendar_enabled",
    href: "https://calendar.google.com",
  },
  {
    key: "resend",
    icon: "mail",
    iconCls: "bg-rose-50 text-rose-600",
    name: "Resend",
    desc: "Envio de emails transacionais com alta entregabilidade.",
    settingKey: "resend_enabled",
    href: "https://resend.com",
  },
  {
    key: "google_maps",
    icon: "map",
    iconCls: "bg-amber-50 text-amber-600",
    name: "Google Maps",
    desc: "Mapa no perfil público da clínica para facilitar a localização.",
    settingKey: "maps_enabled",
    href: "https://maps.google.com",
  },
]

export default async function IntegracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const settings: Record<string, unknown> = {}

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Integrações</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Conecte o NaviClin com as ferramentas que você já usa</p>
      </div>

      <div className="space-y-3">
        {integrations.map((intg) => {
          const enabled = Boolean(settings[intg.settingKey])
          return (
            <div key={intg.key} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4 shadow-premium-sm">
              <div className={`w-12 h-12 rounded-xl ${intg.iconCls} flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{intg.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-on-surface">{intg.name}</p>
                  {enabled && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined" style={{ fontSize: 10 }}>check_circle</span>
                      Conectado
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant mt-0.5">{intg.desc}</p>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-medium border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-xl hover:border-primary hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>settings</span>
                {enabled ? "Configurar" : "Conectar"}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-on-surface-variant">
        Mais integrações em breve: Zoom, Calendly, iFood Saúde e outros. Solicite pelo suporte.
      </p>
    </div>
  )
}
