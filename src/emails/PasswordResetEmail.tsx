import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface PasswordResetEmailProps {
  userName: string
  resetUrl: string
}

export function PasswordResetEmail({ userName, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Redefinição de senha — NaviClin</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={logo}>
            <span style={logoText}>NaviClin</span>
          </div>

          <Heading style={h1}>Redefinição de senha</Heading>

          <Text style={text}>Olá, <strong>{userName}</strong>,</Text>

          <Text style={text}>
            Recebemos um pedido para redefinir a senha da sua conta na NaviClin.
          </Text>

          <Text style={text}>
            Sabemos que o seu acesso é importante. Para criar uma nova senha e voltar a acessar a
            plataforma de forma segura, basta clicar no botão abaixo:
          </Text>

          <Section style={buttonSection}>
            <Button href={resetUrl} style={button}>
              Redefinir Minha Senha
            </Button>
          </Section>

          <Text style={infoBox}>
            <strong>Este link é válido por 24 horas.</strong> Por questões de segurança, após esse
            período será necessário solicitar uma nova redefinição.
          </Text>

          <Text style={text}>
            Se você não fez este pedido, pode ignorar este e-mail com tranquilidade. A sua senha
            atual permanece a mesma e a sua conta continua totalmente segura.
          </Text>

          <Text style={text}>
            Em caso de dúvidas ou se precisar de ajuda, a nossa equipe de suporte está à disposição.
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
const buttonSection = { textAlign: "center" as const, margin: "28px 0" }
const button = {
  backgroundColor: "#0D3A6B",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
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
