import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft, Bell, MessageSquare, Mail, Clock } from "lucide-react"
import Link from "next/link"

const notifications = [
  {
    icon: MessageSquare,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    title: "Confirmação por WhatsApp",
    description: "Enviar mensagem de confirmação quando um agendamento for criado",
    defaultChecked: true,
  },
  {
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    title: "Lembrete 24h antes",
    description: "Enviar lembrete para o paciente um dia antes da consulta",
    defaultChecked: true,
  },
  {
    icon: Clock,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950",
    title: "Lembrete 1h antes",
    description: "Enviar lembrete para o paciente uma hora antes da consulta",
    defaultChecked: false,
  },
  {
    icon: Mail,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950",
    title: "Confirmação por email",
    description: "Enviar email de confirmação do agendamento",
    defaultChecked: false,
  },
  {
    icon: Bell,
    color: "text-pink-600",
    bg: "bg-pink-50 dark:bg-pink-950",
    title: "Notificar cancelamentos",
    description: "Receber notificação quando um paciente cancelar",
    defaultChecked: true,
  },
]

export default async function NotificacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-muted-foreground text-sm">Controle os lembretes automáticos</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <span className="font-semibold text-sm">Automações de agendamento</span>
        </div>
        <div className="divide-y">
          {notifications.map((n) => (
            <div key={n.title} className="flex items-center gap-4 px-6 py-4">
              <div className={`w-10 h-10 rounded-xl ${n.bg} flex items-center justify-center shrink-0`}>
                <n.icon className={`h-5 w-5 ${n.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" defaultChecked={n.defaultChecked} className="sr-only peer" />
                <div className="w-10 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  )
}
