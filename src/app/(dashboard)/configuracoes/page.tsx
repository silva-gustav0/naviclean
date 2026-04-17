import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const settingsSections = [
  {
    icon: "business",
    label: "Informações da Clínica",
    description: "Nome, slug, telefone e localização",
    href: "/configuracoes/clinica",
  },
  {
    icon: "schedule",
    label: "Horários de Atendimento",
    description: "Defina os dias e horários que você atende",
    href: "/configuracoes/horarios",
  },
  {
    icon: "favorite",
    label: "Convênios",
    description: "Planos e convênios aceitos pela clínica",
    href: "/configuracoes/convenios",
  },
  {
    icon: "label",
    label: "Tabelas de Preço",
    description: "Particular, convênios e preços por serviço",
    href: "/configuracoes/tabelas-preco",
  },
  {
    icon: "percent",
    label: "Comissões e Split",
    description: "Regras de comissão e custos diretos",
    href: "/configuracoes/comissoes",
  },
  {
    icon: "person",
    label: "Meu Perfil",
    description: "Nome, foto e dados pessoais",
    href: "/configuracoes/perfil",
  },
  {
    icon: "notifications",
    label: "Notificações",
    description: "WhatsApp, email e lembretes automáticos",
    href: "/configuracoes/notificacoes",
  },
  {
    icon: "credit_card",
    label: "Plano e Cobrança",
    description: "Seu plano atual, faturas e pagamento",
    href: "/configuracoes/plano",
  },
  {
    icon: "shield",
    label: "Segurança",
    description: "Senha e autenticação em dois fatores",
    href: "/configuracoes/seguranca",
  },
  {
    icon: "policy",
    label: "Auditoria LGPD",
    description: "Log de acessos e modificações sensíveis",
    href: "/configuracoes/auditoria",
  },
]

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("*").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const clinicInitial = (clinic.name as string)?.[0]?.toUpperCase() ?? "C"

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Configurações</h2>
        <p className="text-on-surface-variant text-sm mt-1 font-sans">Gerencie sua clínica e preferências</p>
      </div>

      {/* Clinic overview */}
      <div className="surgical-gradient rounded-2xl p-5 text-white flex items-center gap-5 relative overflow-hidden shadow-premium">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-extrabold shrink-0 font-headline border border-white/20">
          {clinicInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-bold text-lg leading-tight">{clinic.name as string}</p>
          <p className="text-white/60 text-sm font-sans">naviclin.com/c/{clinic.slug as string}</p>
          {clinic.address_city && (
            <p className="text-white/40 text-xs mt-0.5 font-sans">{clinic.address_city as string}, {clinic.address_state as string}</p>
          )}
        </div>
        <Link
          href="/configuracoes/clinica"
          className="text-xs text-white/70 hover:text-white font-semibold shrink-0 font-sans transition-colors"
        >
          Editar
        </Link>
        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/5" style={{ fontSize: 100, fontVariationSettings: "'FILL' 1" }}>
          business
        </span>
      </div>

      {/* Settings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {settingsSections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 flex items-center gap-4 hover:border-nc-secondary/30 hover:shadow-premium-sm transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-nc-secondary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {s.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-semibold text-sm text-primary">{s.label}</p>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-snug font-sans">{s.description}</p>
            </div>
            <span className="material-symbols-outlined text-outline text-lg group-hover:text-nc-secondary group-hover:translate-x-0.5 transition-all shrink-0">
              arrow_forward
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
