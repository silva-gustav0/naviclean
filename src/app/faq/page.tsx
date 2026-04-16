import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ — NaviClin",
  description: "Respostas para as dúvidas mais frequentes sobre o NaviClin: planos, migração, segurança, suporte e financeiro.",
}

const categories = [
  {
    name: "Planos e preços",
    faqs: [
      { q: "Tem teste grátis?", a: "Sim! 14 dias grátis em qualquer plano, sem cartão de crédito necessário." },
      { q: "Posso mudar de plano?", a: "Sim, a qualquer momento. O valor é ajustado proporcionalmente no próximo ciclo." },
      { q: "O plano anual tem desconto?", a: "Sim, 20% de desconto — equivale a 2 meses grátis comparado ao plano mensal." },
      { q: "Como funciona o cancelamento?", a: "Sem multa e sem fidelidade. Cancele pelo painel de configurações a qualquer momento. Você mantém acesso até o fim do ciclo pago." },
    ],
  },
  {
    name: "Migração de dados",
    faqs: [
      { q: "Posso importar pacientes de outro sistema?", a: "Sim. Aceitamos importação via planilha CSV/Excel. Nossa equipe de suporte auxilia no processo sem custo adicional." },
      { q: "E os prontuários físicos?", a: "Disponibilizamos escaneamento digital assistido. Entre em contato para saber mais." },
      { q: "Quanto tempo leva a migração?", a: "Depende do volume. Migrações simples ficam prontas em 1 dia útil. Bases grandes podem levar até 5 dias." },
    ],
  },
  {
    name: "Segurança e LGPD",
    faqs: [
      { q: "Os dados são criptografados?", a: "Sim. Usamos criptografia AES-256 em repouso e TLS 1.3 em trânsito." },
      { q: "Onde ficam os servidores?", a: "No Brasil, em data centers certificados ISO 27001 para garantir conformidade com a LGPD." },
      { q: "O NaviClin é adequado para a LGPD?", a: "Sim. Temos DPO designado, contratos de processamento de dados e mecanismos de portabilidade e exclusão." },
      { q: "Tem backup automático?", a: "Sim. Backups diários com retenção de 30 dias. Incluímos backups sob demanda no plano Pro." },
    ],
  },
  {
    name: "Suporte",
    faqs: [
      { q: "Como funciona o suporte?", a: "Chat, email e WhatsApp. Tempo médio de resposta: 2 horas úteis. Plano Pro inclui suporte prioritário com SLA de 30 minutos." },
      { q: "Tem treinamento?", a: "Sim! Ao assinar qualquer plano, você recebe onboarding guiado e acesso à base de conhecimento completa." },
      { q: "E se meu sistema cair?", a: "Temos SLA de 99,9% de uptime. Em caso de incidente, comunicamos por email e WhatsApp em tempo real." },
    ],
  },
  {
    name: "Financeiro",
    faqs: [
      { q: "Como funciona o pagamento?", a: "Cartão de crédito ou boleto bancário. Processamento seguro via Stripe." },
      { q: "Emitem nota fiscal?", a: "Sim. NF-e enviada automaticamente por email após cada cobrança." },
      { q: "Posso adicionar mais profissionais depois?", a: "Sim. Você pode fazer upgrade de plano a qualquer momento conforme sua clínica cresce." },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-16 px-6 text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-3">Perguntas frequentes</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Não encontrou o que precisa? Fale com nossa equipe pelo{" "}
            <a href="/contato" className="text-[#0D3A6B] hover:underline font-medium">formulário de contato</a>.
          </p>
        </section>

        {/* FAQs by category */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto space-y-10">
            {categories.map((cat) => (
              <div key={cat.name}>
                <h2 className="text-lg font-bold text-[#0D3A6B] mb-4 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  {cat.name}
                </h2>
                <div className="space-y-3">
                  {cat.faqs.map((faq) => (
                    <details key={faq.q} className="group border rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-sm select-none list-none">
                        {faq.q}
                        <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                      </summary>
                      <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t bg-slate-50/50 pt-3">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-6 bg-[#F7F9FC] border-t">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Ainda tem dúvidas?</h2>
            <p className="text-slate-500 text-sm mb-4">Nossa equipe responde em até 2 horas úteis.</p>
            <a
              href="/contato"
              className="inline-flex items-center gap-2 bg-[#0D3A6B] hover:bg-[#1A5599] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Falar com suporte
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
