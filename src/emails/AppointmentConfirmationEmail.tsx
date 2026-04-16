import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface AppointmentConfirmationEmailProps {
  patientName: string
  clinicName: string
  dentistName: string
  date: string
  time: string
  address?: string
}

export function AppointmentConfirmationEmail({
  patientName,
  clinicName,
  dentistName,
  date,
  time,
  address,
}: AppointmentConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Consulta confirmada em {clinicName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Consulta Confirmada</Heading>
          <Text style={text}>Olá, {patientName}!</Text>
          <Text style={text}>
            Sua consulta na <strong>{clinicName}</strong> foi confirmada.
          </Text>
          <Section style={infoBox}>
            <Text style={infoRow}>
              <strong>Profissional:</strong> {dentistName}
            </Text>
            <Text style={infoRow}>
              <strong>Data:</strong> {date}
            </Text>
            <Text style={infoRow}>
              <strong>Horário:</strong> {time}
            </Text>
            {address && (
              <Text style={infoRow}>
                <strong>Endereço:</strong> {address}
              </Text>
            )}
          </Section>
          <Text style={text}>
            Em caso de necessidade de cancelamento ou reagendamento, entre em contato com a clínica
            com pelo menos 24 horas de antecedência.
          </Text>
          <Text style={footer}>Esta é uma mensagem automática do NaviClin.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "560px",
  borderRadius: "8px",
}
const h1 = { color: "#0D3A6B", fontSize: "24px", fontWeight: "700", margin: "0 0 16px" }
const text = { color: "#374151", fontSize: "15px", lineHeight: "1.6", margin: "0 0 12px" }
const infoBox = {
  backgroundColor: "#F0F7FF",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
}
const infoRow = { color: "#374151", fontSize: "14px", margin: "0 0 6px" }
const footer = { color: "#9CA3AF", fontSize: "13px", margin: "24px 0 0" }
