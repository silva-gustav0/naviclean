import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Roadmap — NaviClin",
  description: "Veja o que estamos construindo no NaviClin — funcionalidades lançadas, em desenvolvimento e planejadas.",
}

const launched = [
  { title: "Agenda multi-profissional", desc: "Encaixes automáticos, bloqueios por sala e confirmação por WhatsApp." },
  { title: "Prontuário digital + Odontograma", desc: "Histórico completo, anamnese personalizada e assinatura digital." },
  { title: "Financeiro em tempo real", desc: "DRE automático, comissões e conciliação bancária." },
  { title: "Portal do paciente", desc: "Acesso ao histórico, agendamentos e receitas pelo celular." },
  { title: "Gestão de estoque", desc: "Controle por cadeira, alerta de mínimo e integração com fornecedores." },
  { title: "Comunicação automatizada", desc: "WhatsApp, email e SMS integrados para confirmações e campanhas." },
  { title: "Módulo médico (20+ especialidades)", desc: "Prontuário médico, telemedicina e integração com odontologia." },
]

const inProgress = [
  { title: "App mobile para profissionais", desc: "Agenda, prontuário e financeiro na palma da mão.", quarter: "Q2 2026" },
  { title: "BI e relatórios avançados", desc: "Dashboards personalizáveis com indicadores clínicos e financeiros.", quarter: "Q2 2026" },
  { title: "Integração com convênios", desc: "TISS automatizado, guias e faturamento para planos de saúde.", quarter: "Q3 2026" },
  { title: "Telemedicina integrada", desc: "Videoconsulta dentro da plataforma com prontuário em tempo real.", quarter: "Q3 2026" },
]

const planned = [
  { title: "API pública REST", desc: "Integração com sistemas externos e parceiros da clínica.", quarter: "Q4 2026" },
  { title: "Multi-unidade avançado", desc: "Gestão centralizada de redes de clínicas com dashboards consolidados.", quarter: "Q4 2026" },
  { title: "Inteligência artificial", desc: "Sugestões de diagnóstico, análise de imagens e otimização de agenda.", quarter: "2027" },
  { title: "Marketplace de integrações", desc: "Conecte o NaviClin a fornecedores, operadoras e parceiros.", quarter: "2027" },
]

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-primary/10 py-20 px-6 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Transparência</span>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-primary mb-4">
            O que estamos construindo
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Acreditamos em transparência. Aqui você acompanha o que já entregamos, o que está sendo desenvolvido e o que vem a seguir.
          </p>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
          {/* Lançado */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h2 className="font-headline font-extrabold text-2xl text-primary">Já disponível</h2>
              <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">{launched.length} funcionalidades</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {launched.map((item) => (
                <div key={item.title} className="flex gap-3 p-4 border border-emerald-200 dark:border-emerald-800 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 shrink-0" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <div className="font-semibold text-sm text-on-surface">{item.title}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Em desenvolvimento */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="font-headline font-extrabold text-2xl text-primary">Em desenvolvimento</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgress.map((item) => (
                <div key={item.title} className="flex gap-3 p-4 border border-amber-200 dark:border-amber-800 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 shrink-0" style={{ fontSize: 20 }}>build_circle</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-on-surface">{item.title}</div>
                      <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{item.quarter}</span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planejado */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <h2 className="font-headline font-extrabold text-2xl text-primary">Planejado</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planned.map((item) => (
                <div key={item.title} className="flex gap-3 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-outline shrink-0" style={{ fontSize: 20 }}>schedule</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-on-surface">{item.title}</div>
                      <span className="text-xs text-on-surface-variant font-semibold">{item.quarter}</span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sugestão */}
          <div className="border border-outline-variant rounded-2xl p-8 bg-surface-container-low text-center">
            <span className="material-symbols-outlined text-nc-secondary text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <h3 className="font-headline font-bold text-xl text-primary mb-2">Tem uma sugestão?</h3>
            <p className="text-on-surface-variant text-sm mb-4 max-w-md mx-auto">
              Construímos o NaviClin junto com nossos clientes. Sua ideia pode ser a próxima funcionalidade do roadmap.
            </p>
            <a href="/contato" className="inline-flex items-center gap-2 surgical-gradient text-white font-semibold px-6 py-3 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity text-sm">
              Enviar sugestão
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
