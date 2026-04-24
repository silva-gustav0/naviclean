import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface TwoFactorEmailProps {
  userName: string
  code: string
}

export function TwoFactorEmail({ userName, code }: TwoFactorEmailProps) {
  const digits = code.split("")

  return (
    <Html>
      <Head />
      <Preview>Seu código de verificação NaviClin: {code}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={logo}>
            <span style={logoText}>NaviClin</span>
          </div>

          <Heading style={h1}>Código de verificação</Heading>

          <Text style={text}>Olá, <strong>{userName}</strong>,</Text>

          <Text style={text}>
            Para concluir o seu login na NaviClin de forma segura, utilize o código de verificação
            abaixo:
          </Text>

          <Section style={codeSection}>
            <div style={codeWrapper}>
              {digits.map((d, i) => (
                <span key={i} style={codeDigit}>{d}</span>
              ))}
            </div>
          </Section>

          <Text style={infoBox}>
            <strong>Este código é válido por 15 minutos.</strong> Por questões de segurança, nunca
            compartilhe este código com ninguém. A nossa equipe nunca pedirá a sua senha ou código de
            acesso por telefone, SMS ou WhatsApp.
          </Text>

          <Text style={text}>
            Se você não tentou fazer login recentemente, recomendamos que redefina a sua senha
            imediatamente para garantir a proteção dos seus dados e dos seus pacientes.
          </Text>

          <Text style={signature}>
            Um abraço,<br />
            <strong>Equipe NaviClin</strong>
          </Text>

          <Section style={footerSection}>
            <Link href="https://naviclean.vercel.app/contato" style={footerLink}>
              Falar com suporte
            </Link>
            <Text style={footer}>© 2026 NaviClin. Todos os direitos reservados.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f0f4f8", fontFamily: "Arial, sans-serif" }
const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "48px 40px",
  maxWidth: "560px",
  borderRadius: "12px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
}
const logo = { marginBottom: 32 }
const logoText = { color: "#00244a", fontSize: 22, fontWeight: "700" }
const h1 = { color: "#00244a", fontSize: "24px", fontWeight: "700", margin: "0 0 20px" }
const text = { color: "#374151", fontSize: "15px", lineHeight: "1.65", margin: "0 0 14px" }
const codeSection = { textAlign: "center" as const, margin: "28px 0" }
const codeWrapper = { display: "inline-flex", gap: 10 }
const codeDigit = {
  display: "inline-block",
  width: 52,
  height: 64,
  lineHeight: "64px",
  textAlign: "center" as const,
  fontSize: 28,
  fontWeight: "700",
  color: "#00244a",
  backgroundColor: "#f0f4f8",
  border: "2px solid #c9943a",
  borderRadius: 10,
}
const infoBox = {
  backgroundColor: "#fef9ec",
  border: "1px solid #f5d68a",
  borderRadius: "8px",
  padding: "14px 16px",
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 20px",
}
const signature = { color: "#374151", fontSize: "15px", lineHeight: "1.7", margin: "24px 0 0" }
const footerSection = { borderTop: "1px solid #e5e7eb", marginTop: 32, paddingTop: 20 }
const footerLink = { color: "#0D3A6B", fontSize: "13px", textDecoration: "underline" }
const footer = { color: "#9CA3AF", fontSize: "12px", margin: "8px 0 0" }
