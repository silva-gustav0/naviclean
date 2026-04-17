import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const notifications = [
  { icon: "chat", iconCls: "text-emerald-600", bg: "bg-emerald-50", title: "Confirmação por WhatsApp", description: "Enviar mensagem de confirmação quando um agendamento for criado", defaultChecked: true },
  { icon: "schedule", iconCls: "text-blue-600", bg: "bg-blue-50", title: "Lembrete 24h antes", description: "Enviar lembrete para o paciente um dia antes da consulta", defaultChecked: true },
  { icon: "timer", iconCls: "text-primary", bg: "bg-primary/10", title: "Lembrete 1h antes", description: "Enviar lembrete para o paciente uma hora antes da consulta", defaultChecked: false },
  { icon: "mail", iconCls: "text-nc-secondary", bg: "bg-nc-secondary/10", title: "Confirmação por email", description: "Enviar email de confirmação do agendamento", defaultChecked: false },
  { icon: "notifications", iconCls: "text-pink-600", bg: "bg-pink-50", title: "Notificar cancelamentos", description: "Receber notificação quando um paciente cancelar", defaultChecked: true },
]

export default async function NotificacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Notificações</h1>
          <p className="text-on-surface-variant text-sm">Controle os lembretes automáticos</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container">
          <span className="font-semibold text-sm text-on-surface">Automações de agendamento</span>
        </div>
        <div className="divide-y divide-outline-variant/50">
          {notifications.map((n) => (
            <div key={n.title} className="flex items-center gap-4 px-6 py-4">
              <div className={`w-10 h-10 rounded-xl ${n.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${n.iconCls}`} style={{ fontSize: 20 }}>{n.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">{n.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{n.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" defaultChecked={n.defaultChecked} className="sr-only peer" />
                <div className="w-10 h-6 bg-surface-container-high peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container">
          <button className="surgical-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity">
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  )
}
