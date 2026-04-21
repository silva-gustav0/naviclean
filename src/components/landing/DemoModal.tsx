"use client"

import { useEffect, useRef, useState } from "react"

export function DemoModal() {
  const [name, setName] = useState("")
  const [clinic, setClinic] = useState("")
  const [phone, setPhone] = useState("")
  const [success, setSuccess] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  const close = () => {
    backdropRef.current?.classList.remove("open")
    document.body.style.overflow = ""
    setTimeout(() => setSuccess(false), 300)
  }

  useEffect(() => {
    const el = backdropRef.current
    if (!el) return
    el.id = "demoModal"
    const onClick = (e: MouseEvent) => { if (e.target === el) close() }
    el.addEventListener("click", onClick)
    return () => el.removeEventListener("click", onClick)
  }, [])

  const submit = () => {
    if (!name.trim()) return
    setSuccess(true)
  }

  return (
    <div
      ref={backdropRef}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(11,16,32,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      className="modal-backdrop-el"
    >
      <div style={{
        background: "var(--card)",
        borderRadius: 22,
        width: "100%",
        maxWidth: 520,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(15,26,68,.14)",
      }}>
        {!success ? (
          <>
            <div style={{ padding: "28px 32px", borderBottom: "1px solid var(--nc-outline-variant)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-headline)", fontSize: 24, fontWeight: 500, color: "var(--nc-on-surface)", letterSpacing: "-0.02em", marginBottom: 4 }}>
                  Agendar demonstração
                </h3>
                <p style={{ fontSize: 14, color: "var(--nc-on-surface-variant)" }}>Fale com um especialista em até 24h.</p>
              </div>
              <button onClick={close} style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--background)", border: "1px solid var(--nc-outline-variant)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--nc-on-surface-variant)", fontSize: 18 }}>×</button>
            </div>

            <div style={{ padding: "28px 32px" }}>
              {[
                { label: "Seu nome *", value: name, set: setName, type: "text", placeholder: "Dr. João Silva" },
                { label: "Clínica", value: clinic, set: setClinic, type: "text", placeholder: "Clínica Exemplo" },
                { label: "WhatsApp", value: phone, set: setPhone, type: "tel", placeholder: "(11) 99999-9999" },
              ].map((f) => (
                <div key={f.label} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--nc-on-surface-variant)", fontWeight: 500, marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--nc-outline-variant)", borderRadius: 8, background: "var(--background)", fontSize: 14, color: "var(--nc-on-surface)", outline: "none", transition: "border-color .2s" }}
                    className="modal-input"
                  />
                </div>
              ))}
            </div>

            <div style={{ padding: "20px 32px 28px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={close} style={{ padding: "12px 20px", borderRadius: 999, border: "1px solid var(--nc-outline-variant)", background: "transparent", color: "var(--nc-on-surface)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Cancelar</button>
              <button onClick={submit} style={{ padding: "12px 24px", borderRadius: 999, border: "none", background: "var(--nc-secondary)", color: "var(--nc-on-secondary)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "transform .15s" }} className="modal-submit">
                Confirmar agendamento
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--nc-secondary)", color: "var(--nc-on-secondary)", display: "grid", placeItems: "center", margin: "0 auto 20px", fontSize: 28 }}>✓</div>
            <h3 style={{ fontFamily: "var(--font-headline)", fontSize: 24, fontWeight: 500, color: "var(--nc-on-surface)", marginBottom: 8 }}>Recebido, {name.split(" ")[0]}!</h3>
            <p style={{ color: "var(--nc-on-surface-variant)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Nossa equipe vai entrar em contato em até 24h para agendar sua demonstração personalizada.</p>
            <button onClick={close} style={{ padding: "12px 24px", borderRadius: 999, border: "none", background: "var(--nc-secondary)", color: "var(--nc-on-secondary)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Fechar</button>
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop-el.open { display: flex !important; }
        .modal-input:focus { border-color: var(--nc-secondary) !important; }
        .modal-submit:hover { transform: translateY(-1px); }
      `}</style>
    </div>
  )
}
