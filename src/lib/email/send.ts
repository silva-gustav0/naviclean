import { Resend } from "resend"
import type { ReactElement } from "react"

let resendInstance: Resend | null = null

function getResend(): Resend {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error("RESEND_API_KEY not configured")
    resendInstance = new Resend(key)
  }
  return resendInstance
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[]
  subject: string
  react: ReactElement
}) {
  const resend = getResend()
  const from = process.env.RESEND_FROM ?? "NaviClin <no-reply@naviclin.com.br>"

  const { data, error } = await resend.emails.send({ from, to, subject, react })
  if (error) throw new Error(`Email send failed: ${error.message}`)
  return data
}
