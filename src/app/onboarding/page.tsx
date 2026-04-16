"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Building2, Link as LinkIcon, Phone, MapPin, ChevronRight, Check } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"

const onboardingSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Apenas letras minusculas, numeros e hifens"),
  phone: z.string().min(10, "Telefone invalido"),
  address_city: z.string().min(2, "Cidade obrigatoria"),
  address_state: z.string().length(2, "Use a sigla do estado (ex: SP)"),
})

type OnboardingForm = z.infer<typeof onboardingSchema>

const steps = [
  { label: "Identidade", icon: Building2 },
  { label: "Contato", icon: Phone },
  { label: "Localização", icon: MapPin },
]

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0)
  const supabase = createClient()

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      slug: "",
      phone: "",
      address_city: "",
      address_state: "",
    },
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
    let fieldsToValidate: (keyof OnboardingForm)[] = []
    if (step === 0) fieldsToValidate = ["name", "slug"]
    if (step === 1) fieldsToValidate = ["phone"]

    const valid = await form.trigger(fieldsToValidate)
    if (valid) setStep((s) => s + 1)
  }

  async function onSubmit(data: OnboardingForm) {
    setIsLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      window.location.href = "/login"
      return
    }

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

  const nameValue = form.watch("name")
  const slugValue = form.watch("slug")

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Left panel */}
      <div className="hidden lg:flex w-96 flex-col bg-gradient-to-br from-blue-600 to-violet-700 p-10 text-white">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="font-bold text-lg">N</span>
          </div>
          <span className="font-bold text-xl">NaviClin</span>
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-3 leading-snug">Configure sua clínica em 2 minutos</h2>
          <p className="text-blue-200 mb-10">Preencha as informações básicas e comece a usar todas as funcionalidades agora mesmo.</p>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  i < step ? "bg-white text-blue-600" :
                  i === step ? "bg-white/30 text-white ring-2 ring-white" :
                  "bg-white/10 text-white/50"
                }`}>
                  {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`font-medium transition-colors ${i <= step ? "text-white" : "text-white/50"}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-blue-300">
                    {i === 0 && "Nome e URL da clínica"}
                    {i === 1 && "Telefone / WhatsApp"}
                    {i === 2 && "Cidade e estado"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300 text-sm">Você pode editar tudo isso depois nas Configurações.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold">NaviClin</span>
          </div>

          {/* Step indicator mobile */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-blue-600" : "bg-slate-200"}`} />
            ))}
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Etapa {step + 1} de {steps.length}</p>
            <h1 className="text-2xl font-bold">
              {step === 0 && "Como se chama sua clínica?"}
              {step === 1 && "Como os pacientes falam com você?"}
              {step === 2 && "Onde fica sua clínica?"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {step === 0 && "Essas informações aparecem para seus pacientes."}
              {step === 1 && "Informe o WhatsApp principal da clínica."}
              {step === 2 && "Usamos para exibir nos resultados de busca."}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Step 0: Identity */}
              {step === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da clínica</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="Clínica Sorriso Perfeito"
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
                      <FormItem>
                        <FormLabel>Identificador (URL)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="minha-clinica"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        {slugValue && (
                          <p className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 mt-1">
                            🔗 naviclin.com/c/<strong>{slugValue}</strong>
                          </p>
                        )}
                        <FormDescription>Apenas letras minúsculas, números e hífens.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 1: Contact */}
              {step === 1 && (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9 text-lg" placeholder="(11) 99999-9999" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="address_city"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="São Paulo" {...field} />
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
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SP"
                            maxLength={2}
                            className="text-center font-mono uppercase"
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

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    Voltar
                  </Button>
                )}

                {step < steps.length - 1 ? (
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={nextStep}
                  >
                    Continuar
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Criar clínica
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
