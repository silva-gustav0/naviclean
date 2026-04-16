import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessageSquare, CreditCard, Calendar, Mail, Globe, Check, Settings } from "lucide-react"

const integrations = [
  {
    key: "whatsapp",
    icon: MessageSquare,
    name: "WhatsApp Business",
    desc: "Envio automático de confirmações, lembretes e pós-consulta.",
    color: "bg-emerald-100 text-emerald-600",
    settingKey: "whatsapp_enabled",
    href: "https://business.whatsapp.com",
  },
  {
    key: "stripe",
    icon: CreditCard,
    name: "Stripe",
    desc: "Cobrança online, link de pagamento e portal do cliente.",
    color: "bg-violet-100 text-violet-600",
    settingKey: "stripe_enabled",
    href: "https://dashboard.stripe.com",
  },
  {
    key: "google_calendar",
    icon: Calendar,
    name: "Google Calendar",
    desc: "Sincronize a agenda com o Google Calendar dos profissionais.",
    color: "bg-blue-100 text-blue-600",
    settingKey: "google_calendar_enabled",
    href: "https://calendar.google.com",
  },
  {
    key: "resend",
    icon: Mail,
    name: "Resend",
    desc: "Envio de emails transacionais com alta entregabilidade.",
    color: "bg-rose-100 text-rose-600",
    settingKey: "resend_enabled",
    href: "https://resend.com",
  },
  {
    key: "google_maps",
    icon: Globe,
    name: "Google Maps",
    desc: "Mapa no perfil público da clínica para facilitar a localização.",
    color: "bg-amber-100 text-amber-600",
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
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="text-muted-foreground text-sm">Conecte o NaviClin com as ferramentas que você já usa</p>
      </div>

      <div className="space-y-3">
        {integrations.map((intg) => {
          const enabled = Boolean(settings[intg.settingKey])
          return (
            <div key={intg.key} className="bg-white dark:bg-slate-900 border rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${intg.color} flex items-center justify-center shrink-0`}>
                <intg.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{intg.name}</p>
                  {enabled && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3" />
                      Conectado
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{intg.desc}</p>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-xl hover:border-[#0D3A6B] hover:text-[#0D3A6B] transition-colors">
                <Settings className="h-3.5 w-3.5" />
                {enabled ? "Configurar" : "Conectar"}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Mais integrações em breve: Zoom, Calendly, iFood Saúde e outros. Solicite pelo suporte.
      </p>
    </div>
  )
}
