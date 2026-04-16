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

interface ReviewRequestEmailProps {
  patientName: string
  clinicName: string
  reviewUrl: string
}

export function ReviewRequestEmail({ patientName, clinicName, reviewUrl }: ReviewRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Como foi sua experiência em {clinicName}?</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Avalie sua consulta</Heading>
          <Text style={text}>Olá, {patientName}!</Text>
          <Text style={text}>
            Sua consulta em <strong>{clinicName}</strong> foi concluída. Gostaríamos muito de saber
            como foi sua experiência!
          </Text>
          <Text style={text}>
            Deixar uma avaliação leva menos de 1 minuto e ajuda outros pacientes a encontrar bons
            profissionais.
          </Text>
          <Section style={buttonSection}>
            <Button href={reviewUrl} style={button}>
              ⭐ Avaliar minha consulta
            </Button>
          </Section>
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
const buttonSection = { textAlign: "center" as const, margin: "24px 0" }
const button = {
  backgroundColor: "#F59E0B",
  color: "#ffffff",
  padding: "12px 28px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
}
const footer = { color: "#9CA3AF", fontSize: "13px", margin: "24px 0 0" }
