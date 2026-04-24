import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const modules = [
  {
    icon: "calendar_month",
    title: "Agenda",
    desc: "Aprenda a gerenciar agendamentos, bloqueios de horário e confirmações automáticas.",
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
    lessons: ["Criar um agendamento", "Bloquear horários", "Configurar confirmação automática", "Sala de espera"],
    href: "/agenda",
  },
  {
    icon: "assignment_ind",
    title: "Pacientes",
    desc: "Cadastre e gerencie pacientes, históricos e anamneses digitais.",
    color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300",
    lessons: ["Cadastrar novo paciente", "Preencher anamnese", "Ver histórico", "Enviar link de cadastro"],
    href: "/pacientes",
  },
  {
    icon: "payments",
    title: "Financeiro",
    desc: "Controle receitas, despesas, comissões e gere relatórios completos.",
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300",
    lessons: ["Registrar receita", "Lançar despesa", "Configurar comissões", "Gerar DRE"],
    href: "/financeiro",
  },
  {
    icon: "groups",
    title: "Equipe",
    desc: "Adicione profissionais, defina permissões e gerencie sua equipe.",
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300",
    lessons: ["Convidar membro", "Definir permissões", "Ver agenda por profissional", "Comissões da equipe"],
    href: "/equipe",
  },
  {
    icon: "stethoscope",
    title: "Tratamentos",
    desc: "Cadastre serviços, crie planos de tratamento e tabelas de preço.",
    color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300",
    lessons: ["Adicionar serviço", "Criar tabela de preços", "Planos de tratamento", "Categorias"],
    href: "/tratamentos",
  },
  {
    icon: "inventory_2",
    title: "Estoque",
    desc: "Gerencie produtos, lotes, validades e importação de NF-e.",
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300",
    lessons: ["Cadastrar produto", "Registrar entrada", "Importar NF-e", "Alertas de mínimo"],
    href: "/estoque",
  },
  {
    icon: "settings",
    title: "Configurações",
    desc: "Configure horários, perfil da clínica, integrações e plano.",
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300",
    lessons: ["Horários de atendimento", "Perfil da clínica", "Integrações", "Plano e assinatura"],
    href: "/configuracoes",
  },
]

const guides = [
  { icon: "rocket_launch", title: "Guia de início rápido", desc: "Configure sua clínica do zero em menos de 15 minutos.", color: "bg-nc-secondary/10 text-nc-secondary" },
  { icon: "psychology", title: "Boas práticas de agenda", desc: "Como organizar sua agenda para reduzir no-shows e faltas.", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" },
  { icon: "bar_chart", title: "Relatórios financeiros", desc: "Interprete o DRE e monitore a saúde financeira da clínica.", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300" },
  { icon: "shield", title: "Segurança e LGPD", desc: "Como o NaviClin protege os dados dos seus pacientes.", color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300" },
]

export default async function TreinamentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Treinamento</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans">Aprenda a usar todos os módulos do NaviClin</p>
        </div>
        <a
          href="/contato"
          className="inline-flex items-center gap-2 border border-outline-variant text-primary font-semibold px-4 py-2.5 rounded-xl hover:bg-surface-container text-sm transition-colors font-headline"
        >
          <span className="material-symbols-outlined text-xl">support_agent</span>
          Falar com Suporte
        </a>
      </div>

      {/* Banner de boas vindas */}
      <div className="surgical-gradient rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Central de Aprendizado</p>
          <h3 className="font-headline font-extrabold text-2xl mb-2">Tudo que você precisa para dominar o NaviClin</h3>
          <p className="text-sm text-white/70">Explore os módulos abaixo, leia os guias rápidos e entre em contato com o suporte se precisar de ajuda personalizada.</p>
        </div>
        <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-white/10" style={{ fontSize: 140 }}>school</span>
      </div>

      {/* Módulos */}
      <section>
        <h3 className="font-headline font-bold text-lg text-primary mb-4">Módulos da plataforma</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div key={mod.title} className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 shadow-premium-sm flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${mod.color} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{mod.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-primary">{mod.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{mod.desc}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {mod.lessons.map((lesson) => (
                  <li key={lesson} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline shrink-0" style={{ fontSize: 14 }}>play_circle</span>
                    {lesson}
                  </li>
                ))}
              </ul>
              <Link
                href={mod.href}
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-nc-secondary hover:underline underline-offset-4 font-headline"
              >
                Ir para o módulo
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Guias rápidos */}
      <section>
        <h3 className="font-headline font-bold text-lg text-primary mb-4">Guias rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((g) => (
            <div key={g.title} className="flex items-start gap-4 p-5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl shadow-premium-sm hover:border-nc-secondary/30 transition-all cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl ${g.color} flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{g.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-headline font-semibold text-sm text-primary">{g.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{g.desc}</p>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-nc-secondary group-hover:translate-x-0.5 transition-all shrink-0">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Suporte */}
      <section className="border border-outline-variant rounded-2xl p-6 bg-surface-container-low text-center">
        <span className="material-symbols-outlined text-nc-secondary text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>headset_mic</span>
        <h3 className="font-headline font-bold text-primary text-lg mb-1">Não encontrou o que procurava?</h3>
        <p className="text-on-surface-variant text-sm mb-4 max-w-sm mx-auto">Nossa equipe de suporte está disponível por e-mail e WhatsApp. Tempo médio de resposta: 2 horas úteis.</p>
        <a
          href="/contato"
          className="inline-flex items-center gap-2 surgical-gradient text-white font-semibold px-6 py-3 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity text-sm"
        >
          Falar com Suporte
        </a>
      </section>
    </div>
  )
}
