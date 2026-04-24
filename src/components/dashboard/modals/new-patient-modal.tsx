"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { createPatient } from "@/app/actions/patients"

export function NewPatientModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [cepLoading, setCepLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [address, setAddress] = useState({ logradouro: "", bairro: "", cidade: "", estado: "" })

  async function handleCep(cep: string) {
    const clean = cep.replace(/\D/g, "")
    if (clean.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setAddress({ logradouro: data.logradouro ?? "", bairro: data.bairro ?? "", cidade: data.localidade ?? "", estado: data.uf ?? "" })
      }
    } catch {
      // silently ignore
    } finally {
      setCepLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    formData.set("logradouro", address.logradouro)
    formData.set("bairro", address.bairro)
    formData.set("cidade", address.cidade)
    formData.set("estado", address.estado)
    startTransition(async () => {
      const result = await createPatient(formData)
      if (result.error) {
        toast.error("Erro ao cadastrar", { description: result.error })
      } else {
        toast.success("Paciente cadastrado!")
        formRef.current?.reset()
        setAddress({ logradouro: "", bairro: "", cidade: "", estado: "" })
        setOpen(false)
      }
    })
  }

  const inputCls = "w-full px-4 py-2.5 text-sm border border-outline-variant/20 rounded-xl bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50"
  const labelCls = "block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1 font-headline"

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 surgical-gradient text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-premium-sm hover:opacity-90 transition-all font-headline"
      >
        <span className="material-symbols-outlined text-xl">person_add</span>
        Novo Paciente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-premium w-full sm:max-w-xl overflow-hidden max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-nc-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>person_add</span>
                </div>
                <h2 className="font-headline font-bold text-primary">Novo Paciente</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
              {/* Nome */}
              <div>
                <label className={labelCls}>Nome completo <span className="text-error normal-case tracking-normal">*</span></label>
                <input name="full_name" type="text" required minLength={3} placeholder="Maria Oliveira" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Telefone / WhatsApp</label>
                  <input name="phone" type="text" placeholder="(11) 99999-9999" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Data de nascimento</label>
                  <input name="date_of_birth" type="date" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Email</label>
                  <input name="email" type="email" placeholder="paciente@email.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>CPF</label>
                  <input name="cpf" type="text" placeholder="000.000.000-00" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Sexo</label>
                  <select name="gender" className={inputCls}>
                    <option value="">Selecione</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Profissão</label>
                  <input name="occupation" type="text" placeholder="Ex: Professor" className={inputCls} />
                </div>
              </div>

              {/* Endereço */}
              <div className="border-t border-outline-variant/10 pt-4">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide font-headline mb-3">Endereço</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className={labelCls}>CEP</label>
                  <div className="relative">
                    <input
                      name="cep"
                      type="text"
                      placeholder="00000-000"
                      className={inputCls}
                      onChange={(e) => handleCep(e.target.value)}
                    />
                    {cepLoading && (
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline animate-spin" style={{ fontSize: 16 }}>autorenew</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Logradouro</label>
                  <input
                    name="logradouro_display"
                    type="text"
                    placeholder="Rua, Av..."
                    className={inputCls}
                    value={address.logradouro}
                    onChange={(e) => setAddress((a) => ({ ...a, logradouro: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Número</label>
                  <input name="numero" type="text" placeholder="123" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Complemento</label>
                  <input name="complemento" type="text" placeholder="Apto 4" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Bairro</label>
                  <input
                    name="bairro_display"
                    type="text"
                    placeholder="Bairro"
                    className={inputCls}
                    value={address.bairro}
                    onChange={(e) => setAddress((a) => ({ ...a, bairro: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Cidade</label>
                  <input
                    name="cidade_display"
                    type="text"
                    placeholder="São Paulo"
                    className={inputCls}
                    value={address.cidade}
                    onChange={(e) => setAddress((a) => ({ ...a, cidade: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelCls}>Estado</label>
                  <input
                    name="estado_display"
                    type="text"
                    placeholder="SP"
                    maxLength={2}
                    className={inputCls}
                    value={address.estado}
                    onChange={(e) => setAddress((a) => ({ ...a, estado: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>

              {/* Observação */}
              <div>
                <label className={labelCls}>Observações</label>
                <textarea name="notes" rows={2} placeholder="Alergias, observações importantes..." className={`${inputCls} resize-none`} />
              </div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-surface-container-lowest py-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold border border-outline-variant rounded-xl hover:bg-surface-container transition-colors text-primary font-headline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold surgical-gradient text-white rounded-xl shadow-premium-sm hover:opacity-90 disabled:opacity-60 transition-all font-headline"
                >
                  {isPending && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>autorenew</span>}
                  Cadastrar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
