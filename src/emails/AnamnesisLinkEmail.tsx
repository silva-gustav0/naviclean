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

interface AnamnesisLinkEmailProps {
  patientName: string
  clinicName: string
  anamnesisUrl: string
  appointmentDate: string
}

export function AnamnesisLinkEmail({
  patientName,
  clinicName,
  anamnesisUrl,
  appointmentDate,
}: AnamnesisLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Preencha sua anamnese antes da consulta em {clinicName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Ficha de Anamnese</Heading>
          <Text style={text}>Olá, {patientName}!</Text>
          <Text style={text}>
            Para otimizar sua consulta de <strong>{appointmentDate}</strong> em{" "}
            <strong>{clinicName}</strong>, pedimos que preencha a ficha de anamnese com antecedência.
          </Text>
          <Text style={text}>
            São apenas algumas perguntas sobre seu histórico de saúde que ajudarão o profissional a
            oferecer um atendimento mais personalizado.
          </Text>
          <Section style={buttonSection}>
            <Button href={anamnesisUrl} style={button}>
              Preencher ficha de anamnese
            </Button>
          </Section>
          <Text style={footer}>
            Este link é único para você e expira após o preenchimento. Esta é uma mensagem
            automática do NaviClin.
          </Text>
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
  backgroundColor: "#059669",
  color: "#ffffff",
  padding: "12px 28px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
}
const footer = { color: "#9CA3AF", fontSize: "13px", margin: "24px 0 0" }
