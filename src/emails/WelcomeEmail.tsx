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

interface WelcomeEmailProps {
  userName: string
  clinicName: string
  loginUrl: string
}

export function WelcomeEmail({ userName, clinicName, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao NaviClin, {userName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bem-vindo ao NaviClin</Heading>
          <Text style={text}>
            Olá, {userName}! A clínica <strong>{clinicName}</strong> está pronta no NaviClin.
          </Text>
          <Text style={text}>
            Acesse o painel para configurar horários, cadastrar pacientes e começar a usar todas as
            funcionalidades.
          </Text>
          <Section style={buttonSection}>
            <Button href={loginUrl} style={button}>
              Acessar minha conta
            </Button>
          </Section>
          <Text style={footer}>
            Qualquer dúvida, responda este e-mail ou acesse nosso suporte.
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
  backgroundColor: "#0D3A6B",
  color: "#ffffff",
  padding: "12px 28px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
}
const footer = { color: "#9CA3AF", fontSize: "13px", margin: "24px 0 0" }
