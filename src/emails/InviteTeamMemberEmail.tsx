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

interface InviteTeamMemberEmailProps {
  inviteeName: string
  clinicName: string
  inviterName: string
  inviteUrl: string
}

export function InviteTeamMemberEmail({
  inviteeName,
  clinicName,
  inviterName,
  inviteUrl,
}: InviteTeamMemberEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Você foi convidado para {clinicName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Convite para equipe</Heading>
          <Text style={text}>Olá, {inviteeName}!</Text>
          <Text style={text}>
            <strong>{inviterName}</strong> convidou você para fazer parte da equipe de{" "}
            <strong>{clinicName}</strong> no NaviClin.
          </Text>
          <Text style={text}>
            Clique no botão abaixo para aceitar o convite e criar sua conta.
          </Text>
          <Section style={buttonSection}>
            <Button href={inviteUrl} style={button}>
              Aceitar convite
            </Button>
          </Section>
          <Text style={text}>
            Se você não esperava este convite, pode ignorar este e-mail com segurança.
          </Text>
          <Text style={footer}>Este link expira em 7 dias.</Text>
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
