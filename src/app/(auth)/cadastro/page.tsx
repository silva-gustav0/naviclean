"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const clinicaSchema = z.object({
  clinic_name: z.string().min(2, "Nome da clínica muito curto"),
  cnpj: z.string().optional(),
  especialidade: z.string().min(1, "Selecione uma especialidade"),
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, { message: "As senhas não coincidem", path: ["confirm_password"] })

const profissionalSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  crm_cro: z.string().optional(),
  especialidade: z.string().min(1, "Selecione uma especialidade"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, { message: "As senhas não coincidem", path: ["confirm_password"] })

type ClinicaForm = z.infer<typeof clinicaSchema>
type ProfissionalForm = z.infer<typeof profissionalSchema>

const especialidades = [
  "Odontologia Geral",
  "Ortodontia",
  "Implantodontia",
  "Endodontia",
  "Periodontia",
  "Cirurgia Bucomaxilofacial",
  "Clínica Médica",
  "Pediatria",
  "Dermatologia",
  "Ginecologia",
  "Ortopedia",
  "Psiquiatria",
  "Medicina Estética",
  "Outra",
]

type PathType = "clinica" | "profissional" | null

export default function CadastroPage() {
  const [path, setPath] = useState<PathType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  const clinicaForm = useForm<ClinicaForm>({
    resolver: zodResolver(clinicaSchema),
    defaultValues: { clinic_name: "", cnpj: "", especialidade: "", full_name: "", email: "", phone: "", password: "", confirm_password: "" },
  })

  const profissionalForm = useForm<ProfissionalForm>({
    resolver: zodResolver(profissionalSchema),
    defaultValues: { full_name: "", crm_cro: "", especialidade: "", email: "", phone: "", password: "", confirm_password: "" },
  })

  async function onSubmitClinica(data: ClinicaForm) {
    setIsLoading(true)
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: "clinic_owner",
          clinic_name: data.clinic_name,
          cnpj: data.cnpj,
          especialidade: data.especialidade,
          phone: data.phone,
        },
      },
    })
    if (error) {
      toast.error("Erro ao criar conta", { description: error.message.includes("already registered") ? "Este email já está cadastrado." : error.message })
      setIsLoading(false)
      return
    }
    if (signUpData.session) {
      toast.success("Conta criada com sucesso!")
      window.location.href = "/onboarding"
    } else {
      toast.success("Conta criada!", { description: "Verifique seu email para confirmar o cadastro." })
      setIsLoading(false)
    }
  }

  async function onSubmitProfissional(data: ProfissionalForm) {
    setIsLoading(true)
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: "independent_professional",
          crm_cro: data.crm_cro,
          especialidade: data.especialidade,
          phone: data.phone,
        },
      },
    })
    if (error) {
      toast.error("Erro ao criar conta", { description: error.message.includes("already registered") ? "Este email já está cadastrado." : error.message })
      setIsLoading(false)
      return
    }
    if (signUpData.session) {
      toast.success("Conta criada com sucesso!")
      window.location.href = "/onboarding"
    } else {
      toast.success("Conta criada!", { description: "Verifique seu email para confirmar o cadastro." })
      setIsLoading(false)
    }
  }

  const inputClass = "w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-outline/50"
  const selectClass = "w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-on-surface"

  // Step 1: choose path
  if (!path) {
    return (
      <>
        <h1 className="text-4xl font-extrabold font-headline text-primary mb-2 tracking-tight">
          Comece grátis hoje
        </h1>
        <p className="text-on-surface-variant font-sans mb-8">
          14 dias sem custo. Sem cartão de crédito.
        </p>

        <p className="text-sm font-semibold text-on-surface mb-4 font-headline">Como você vai usar o NaviClin?</p>
        <div className="grid grid-cols-1 gap-4 mb-8">
          <button
            onClick={() => setPath("clinica")}
            className="flex items-start gap-4 p-5 border-2 border-outline-variant/30 rounded-2xl hover:border-nc-secondary/60 hover:bg-nc-secondary/5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-nc-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-nc-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-nc-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
            </div>
            <div>
              <p className="font-headline font-bold text-primary text-sm">Clínica / Consultório</p>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Tenho uma clínica ou consultório e quero gerenciar toda a operação — agenda, financeiro, equipe e pacientes.
              </p>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-nc-secondary ml-auto shrink-0 self-center">chevron_right</span>
          </button>

          <button
            onClick={() => setPath("profissional")}
            className="flex items-start gap-4 p-5 border-2 border-outline-variant/30 rounded-2xl hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
            </div>
            <div>
              <p className="font-headline font-bold text-primary text-sm">Profissional Independente</p>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Sou dentista, médico ou especialista e quero organizar meus atendimentos de forma prática e autônoma.
              </p>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary ml-auto shrink-0 self-center">chevron_right</span>
          </button>
        </div>

        <p className="text-center text-sm text-on-surface-variant font-sans">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Entrar</Link>
        </p>
      </>
    )
  }

  // Step 2: Clínica form
  if (path === "clinica") {
    return (
      <>
        <button onClick={() => setPath(null)} className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary mb-5 transition-colors font-sans">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Voltar
        </button>
        <h1 className="text-3xl font-extrabold font-headline text-primary mb-1 tracking-tight">Cadastro de Clínica</h1>
        <p className="text-on-surface-variant font-sans mb-7 text-sm">14 dias grátis. Cancele quando quiser.</p>

        <Form {...clinicaForm}>
          <form onSubmit={clinicaForm.handleSubmit(onSubmitClinica)} className="space-y-4">
            <FormField control={clinicaForm.control} name="clinic_name" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Nome da Clínica *</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">local_hospital</span>
                    <input type="text" placeholder="Clínica Saúde & Bem-Estar" autoComplete="organization" className={inputClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={clinicaForm.control} name="cnpj" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">CNPJ (opcional)</label>
                  <FormControl>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">badge</span>
                      <input type="text" placeholder="00.000.000/0001-00" className={inputClass} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={clinicaForm.control} name="especialidade" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Especialidade *</label>
                  <FormControl>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">stethoscope</span>
                      <select className={selectClass} {...field}>
                        <option value="">Selecione</option>
                        {especialidades.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="border-t border-outline-variant/20 pt-4">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans mb-3">Dados do Responsável</p>
            </div>

            <FormField control={clinicaForm.control} name="full_name" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Nome Completo *</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
                    <input type="text" placeholder="Dr. João Silva" autoComplete="name" className={inputClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={clinicaForm.control} name="email" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Email *</label>
                  <FormControl>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                      <input type="email" placeholder="voce@clinica.com" autoComplete="email" className={inputClass} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={clinicaForm.control} name="phone" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Telefone *</label>
                  <FormControl>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">phone</span>
                      <input type="tel" placeholder="(11) 99999-9999" autoComplete="tel" className={inputClass} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={clinicaForm.control} name="password" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Senha *</label>
                  <FormControl>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                      <input type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" autoComplete="new-password" className={inputClass} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={clinicaForm.control} name="confirm_password" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Confirmar Senha *</label>
                  <FormControl>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">lock_reset</span>
                      <input type={showPassword ? "text" : "password"} placeholder="Repita a senha" autoComplete="new-password" className={inputClass} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer font-sans select-none">
              <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="rounded" />
              Mostrar senhas
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 surgical-gradient text-white font-headline font-bold rounded-lg shadow-premium hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>autorenew</span>}
              Criar conta da clínica
            </button>
          </form>
        </Form>

        <p className="mt-5 text-center text-xs text-on-surface-variant font-sans">
          Ao criar uma conta, você concorda com os{" "}
          <Link href="/termos" className="text-primary font-semibold hover:underline underline-offset-4">Termos de Uso</Link>{" "}
          e{" "}
          <Link href="/privacidade" className="text-primary font-semibold hover:underline underline-offset-4">Política de Privacidade</Link>.
        </p>
        <p className="mt-3 text-center text-sm text-on-surface-variant font-sans">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Entrar</Link>
        </p>
      </>
    )
  }

  // Step 2: Profissional form
  return (
    <>
      <button onClick={() => setPath(null)} className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary mb-5 transition-colors font-sans">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
        Voltar
      </button>
      <h1 className="text-3xl font-extrabold font-headline text-primary mb-1 tracking-tight">Cadastro de Profissional</h1>
      <p className="text-on-surface-variant font-sans mb-7 text-sm">14 dias grátis. Cancele quando quiser.</p>

      <Form {...profissionalForm}>
        <form onSubmit={profissionalForm.handleSubmit(onSubmitProfissional)} className="space-y-4">
          <FormField control={profissionalForm.control} name="full_name" render={({ field }) => (
            <FormItem className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Nome Completo *</label>
              <FormControl>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
                  <input type="text" placeholder="Dr. Maria Santos" autoComplete="name" className={inputClass} {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-2 gap-3">
            <FormField control={profissionalForm.control} name="crm_cro" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">CRM / CRO (opcional)</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">badge</span>
                    <input type="text" placeholder="CRO-SP 12345" className={inputClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={profissionalForm.control} name="especialidade" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Especialidade *</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">stethoscope</span>
                    <select className={selectClass} {...field}>
                      <option value="">Selecione</option>
                      {especialidades.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField control={profissionalForm.control} name="email" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Email *</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                    <input type="email" placeholder="voce@email.com" autoComplete="email" className={inputClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={profissionalForm.control} name="phone" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Telefone *</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">phone</span>
                    <input type="tel" placeholder="(11) 99999-9999" autoComplete="tel" className={inputClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField control={profissionalForm.control} name="password" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Senha *</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                    <input type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" autoComplete="new-password" className={inputClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={profissionalForm.control} name="confirm_password" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Confirmar Senha *</label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">lock_reset</span>
                    <input type={showPassword ? "text" : "password"} placeholder="Repita a senha" autoComplete="new-password" className={inputClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer font-sans select-none">
            <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="rounded" />
            Mostrar senhas
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 surgical-gradient text-white font-headline font-bold rounded-lg shadow-premium hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>autorenew</span>}
            Criar minha conta
          </button>
        </form>
      </Form>

      <p className="mt-5 text-center text-xs text-on-surface-variant font-sans">
        Ao criar uma conta, você concorda com os{" "}
        <Link href="/termos" className="text-primary font-semibold hover:underline underline-offset-4">Termos de Uso</Link>{" "}
        e{" "}
        <Link href="/privacidade" className="text-primary font-semibold hover:underline underline-offset-4">Política de Privacidade</Link>.
      </p>
      <p className="mt-3 text-center text-sm text-on-surface-variant font-sans">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Entrar</Link>
      </p>
    </>
  )
}
