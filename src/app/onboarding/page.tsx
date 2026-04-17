"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const onboardingSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Apenas letras minusculas, numeros e hifens"),
  phone: z.string().min(10, "Telefone invalido"),
  address_city: z.string().min(2, "Cidade obrigatoria"),
  address_state: z.string().length(2, "Use a sigla do estado (ex: SP)"),
})

type OnboardingForm = z.infer<typeof onboardingSchema>

const steps = [
  { label: "Dados Clínicos", icon: "local_hospital", desc: "Nome e URL da clínica" },
  { label: "Contato", icon: "call", desc: "Telefone / WhatsApp" },
  { label: "Localização", icon: "location_on", desc: "Cidade e estado" },
  { label: "Finalização", icon: "check_circle", desc: "Pronto!" },
]

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0)
  const supabase = createClient()

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", slug: "", phone: "", address_city: "", address_state: "" },
  })

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  async function nextStep() {
    let fields: (keyof OnboardingForm)[] = []
    if (step === 0) fields = ["name", "slug"]
    if (step === 1) fields = ["phone"]
    const valid = await form.trigger(fields)
    if (valid) setStep((s) => s + 1)
  }

  async function onSubmit(data: OnboardingForm) {
    setIsLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) { window.location.href = "/login"; return }

    const { data: clinic, error } = await supabase
      .from("clinics")
      .insert({
        owner_id: userData.user.id,
        name: data.name,
        slug: data.slug,
        phone: data.phone,
        address_city: data.address_city,
        address_state: data.address_state.toUpperCase(),
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        form.setError("slug", { message: "Esse identificador ja esta em uso" })
        setStep(0)
      } else {
        toast.error("Erro ao criar clinica", { description: error.message })
      }
      setIsLoading(false)
      return
    }

    await supabase.from("clinic_members").insert({
      clinic_id: clinic.id,
      user_id: userData.user.id,
      role: "clinic_owner",
    })

    toast.success("Clínica criada com sucesso!")
    window.location.href = "/dashboard"
  }

  const slugValue = form.watch("slug")
  const stepLabels = ["Dados Clínicos", "Contato", "Localização", "Finalização"]

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-headline font-extrabold tracking-tight text-primary">NaviClin</span>
          <div className="h-4 w-px bg-outline-variant/30 hidden md:block" />
          <span className="text-xs font-sans uppercase tracking-widest text-outline hidden md:block">
            Onboarding Curado
          </span>
        </div>
        <span className="text-xs text-outline">Passo {step + 1} de {steps.length}</span>
      </header>

      <main className="flex-grow pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full flex flex-col gap-12">
          {/* Progress */}
          <div className="w-full space-y-4">
            <div className="flex justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-outline px-1">
              {stepLabels.map((l, i) => (
                <span key={l} className={i === step ? "text-nc-secondary font-bold" : ""}>{l}</span>
              ))}
            </div>
            <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-nc-secondary rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Left editorial */}
            <div className="md:col-span-5 space-y-6">
              <h1 className="text-5xl font-headline font-extrabold text-primary leading-[1.1]">
                Fundação <br />
                <span className="text-nc-secondary">Clínica.</span>
              </h1>
              <p className="text-on-surface-variant leading-relaxed">
                {step === 0 && "Inicie sua jornada no NaviClin. Precisamos dos detalhes fundamentais da sua instituição."}
                {step === 1 && "Como os pacientes chegam até você? Informe o WhatsApp principal da clínica."}
                {step === 2 && "Onde sua clínica está localizada? Usamos para exibir nos resultados de busca."}
                {step === 3 && "Revisão final antes de criarmos seu ambiente de gestão personalizado."}
              </p>
              <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-nc-secondary/30">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-nc-secondary">verified_user</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">Segurança de Dados</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Seus dados são protegidos por criptografia de nível bancário e conformidade com a LGPD.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="md:col-span-7 bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-premium border border-outline-variant/10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    {/* Step 0 */}
                    {step === 0 && (
                      <>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <label className="text-xs font-sans uppercase tracking-wider text-outline">
                                Nome da Unidade / Razão Social
                              </label>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/50">
                                    local_hospital
                                  </span>
                                  <input
                                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/10 outline-none text-primary placeholder:text-outline/40"
                                    placeholder="Ex: City Dental Center"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e)
                                      if (!form.getFieldState("slug").isDirty) {
                                        form.setValue("slug", generateSlug(e.target.value))
                                      }
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <label className="text-xs font-sans uppercase tracking-wider text-outline">
                                Identificador (URL)
                              </label>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/50">
                                    link
                                  </span>
                                  <input
                                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/10 outline-none text-primary placeholder:text-outline/40"
                                    placeholder="minha-clinica"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              {slugValue && (
                                <p className="text-xs text-on-surface-variant bg-surface-container-low rounded-lg px-3 py-2">
                                  naviclin.com/c/<strong className="text-primary">{slugValue}</strong>
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Step 1 */}
                    {step === 1 && (
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <label className="text-xs font-sans uppercase tracking-wider text-outline">
                              Telefone / WhatsApp
                            </label>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/50">
                                  call
                                </span>
                                <input
                                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/10 outline-none text-primary placeholder:text-outline/40 text-lg"
                                  placeholder="(11) 99999-9999"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="address_city"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2 space-y-2">
                              <label className="text-xs font-sans uppercase tracking-wider text-outline">Cidade</label>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/50">
                                    location_on
                                  </span>
                                  <input
                                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/10 outline-none text-primary placeholder:text-outline/40"
                                    placeholder="São Paulo"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address_state"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <label className="text-xs font-sans uppercase tracking-wider text-outline">Estado</label>
                              <FormControl>
                                <input
                                  className="w-full px-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/10 outline-none text-primary text-center font-mono uppercase"
                                  placeholder="SP"
                                  maxLength={2}
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                      <div className="space-y-4 text-sm">
                        <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                          {[
                            { label: "Clínica", value: form.getValues("name") },
                            { label: "URL", value: `naviclin.com/c/${form.getValues("slug")}` },
                            { label: "Telefone", value: form.getValues("phone") },
                            { label: "Cidade", value: `${form.getValues("address_city")} - ${form.getValues("address_state")}` },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between items-center">
                              <span className="text-outline text-xs uppercase tracking-wider">{item.label}</span>
                              <span className="text-primary font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-on-surface-variant text-center">
                          Tudo certo? Clique em <strong>Criar Clínica</strong> para finalizar.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6">
                    <button
                      type="button"
                      onClick={() => step > 0 && setStep((s) => s - 1)}
                      className={`text-sm font-semibold text-outline hover:text-primary transition-colors flex items-center gap-2 group ${step === 0 ? "invisible" : ""}`}
                    >
                      <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
                        arrow_back
                      </span>
                      Voltar
                    </button>

                    {step < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="surgical-gradient px-10 py-4 rounded-lg text-white font-headline font-bold shadow-premium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                      >
                        Continuar
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="surgical-gradient px-10 py-4 rounded-lg text-white font-headline font-bold shadow-premium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-lg">{isLoading ? "autorenew" : "check_circle"}</span>
                        Criar Clínica
                      </button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-10 px-8 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-primary font-bold text-lg">NaviClin</span>
            <p className="text-[10px] text-outline font-sans uppercase tracking-widest mt-1">SaaS de Gestão Clínica Premium</p>
          </div>
          <div className="flex gap-8">
            <a href="/suporte" className="text-xs font-sans text-outline hover:text-nc-secondary transition-colors uppercase tracking-widest">Suporte</a>
            <a href="/privacidade" className="text-xs font-sans text-outline hover:text-nc-secondary transition-colors uppercase tracking-widest">Privacidade</a>
            <a href="/termos" className="text-xs font-sans text-outline hover:text-nc-secondary transition-colors uppercase tracking-widest">Termos</a>
          </div>
          <p className="text-[10px] text-outline/60 font-sans">© 2024 NaviClin SaaS Platform.</p>
        </div>
      </footer>

      {/* Background decoration */}
      <div className="fixed top-0 right-0 -z-10 opacity-20 pointer-events-none overflow-hidden h-full w-full">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[100px]" />
      </div>
    </div>
  )
}
