"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
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

  async function onSubmit(data: OnboardingForm) {
    setIsLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push("/login")
      return
    }

    // Criar clinica
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
      } else {
        toast.error("Erro ao criar clinica", { description: error.message })
      }
      setIsLoading(false)
      return
    }

    // Adicionar como membro da clinica
    await supabase.from("clinic_members").insert({
      clinic_id: clinic.id,
      user_id: userData.user.id,
      role: "clinic_owner",
    })

    toast.success("Clinica criada com sucesso!")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/40">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold">N</span>
          </div>
          <h1 className="text-2xl font-bold">Configure sua clinica</h1>
          <p className="text-muted-foreground text-sm">
            Vamos configurar sua clinica para voce comecar a usar o NaviClean
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informacoes da clinica</CardTitle>
            <CardDescription>Voce pode editar essas informacoes depois nas configuracoes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da clinica</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Clinica Sorriso Perfeito"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            if (!form.getFieldState("slug").isDirty) {
                              form.setValue("slug", generateSlug(e.target.value))
                            }
                          }}
                        />
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
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            naviclean.com/c/
                          </span>
                          <Input className="rounded-l-none" placeholder="minha-clinica" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Apenas letras minusculas, numeros e hifens.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="address_city"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Sao Paulo" {...field} />
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
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar clinica e comecar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
