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
        <p className="nc-section-label text-outline/60 mb-1.5">Sistema</p>
        <h2 className="font-headline font-black text-primary tracking-tight" style={{ fontSize: "1.8rem", letterSpacing: "-0.03em" }}>
          Configurações
        </h2>
        <p className="text-on-surface-variant text-[13px] mt-1 font-sans">Gerencie sua clínica e preferências do sistema</p>
      </div>

      {/* Clinic overview card */}
      <div
        className="relative rounded-2xl p-6 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #001630 0%, #00244a 55%, #001a38 100%)" }}
      >
        {/* Large background monogram */}
        <div
          className="absolute -bottom-6 -right-4 font-headline font-black text-white/[0.05] leading-none select-none pointer-events-none"
          style={{ fontSize: "9rem" }}
        >
          {clinicInitial}
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0 font-headline"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            {clinicInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-bold text-[18px] text-white leading-tight">{clinic.name as string}</p>
            <p className="text-white/45 text-[12px] font-sans mt-0.5">naviclin.com/c/{clinic.slug as string}</p>
            {clinic.address_city && (
              <p className="text-white/30 text-[11px] mt-1 font-sans">
                {clinic.address_city as string}, {clinic.address_state as string}
              </p>
            )}
          </div>
          <Link
            href="/configuracoes/clinica"
            className="text-[12px] text-white/50 hover:text-white font-semibold font-sans transition-colors shrink-0 border border-white/15 px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            Editar
          </Link>
        </div>
      </div>

      {/* Settings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {settingsSections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-card border border-outline-variant/20 rounded-xl p-4 flex items-center gap-3.5 hover:border-nc-secondary/25 hover:shadow-card transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-nc-secondary/10 transition-colors">
              <span
                className="material-symbols-outlined text-outline/60 group-hover:text-nc-secondary transition-colors"
                style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
              >
                {s.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-[13px] text-primary leading-tight">{s.label}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug font-sans">{s.description}</p>
            </div>
            <span
              className="material-symbols-outlined text-outline/30 group-hover:text-nc-secondary group-hover:translate-x-0.5 transition-all shrink-0"
              style={{ fontSize: 16 }}
            >
              arrow_forward
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
