interface WhatsAppMessage {
  phone: string
  message: string
}

interface SendResult {
  success: boolean
  fallbackUrl?: string
}

/**
 * Sends a WhatsApp message via Evolution API or Z-API.
 * Falls back to wa.me link if the API is not configured.
 */
export async function sendWhatsApp({ phone, message }: WhatsAppMessage): Promise<SendResult> {
  const apiUrl = process.env.WHATSAPP_API_URL
  const apiKey = process.env.WHATSAPP_API_KEY
  const instance = process.env.WHATSAPP_INSTANCE ?? "default"

  // Clean phone number (digits only, with country code)
  const cleanPhone = phone.replace(/\D/g, "")
  const phoneWithCountry = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`

  if (!apiUrl || !apiKey) {
    // No API configured — return fallback wa.me link
    const encoded = encodeURIComponent(message)
    return { success: false, fallbackUrl: `https://wa.me/${phoneWithCountry}?text=${encoded}` }
  }

  try {
    // Evolution API format
    const res = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: phoneWithCountry,
        text: message,
      }),
    })

    if (!res.ok) {
      const encoded = encodeURIComponent(message)
      return { success: false, fallbackUrl: `https://wa.me/${phoneWithCountry}?text=${encoded}` }
    }

    return { success: true }
  } catch {
    const encoded = encodeURIComponent(message)
    return { success: false, fallbackUrl: `https://wa.me/${phoneWithCountry}?text=${encoded}` }
  }
}

export function buildReminderMessage({
  patientName,
  clinicName,
  date,
  time,
}: {
  patientName: string
  clinicName: string
  date: string
  time: string
}): string {
  return `Olá, ${patientName}! 👋\n\nLembrete: você tem uma consulta *amanhã* em *${clinicName}*.\n📅 Data: ${date}\n⏰ Horário: ${time}\n\nEm caso de dúvidas ou para reagendar, entre em contato conosco.\n\n_NaviClin_`
}
