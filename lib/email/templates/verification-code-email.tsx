import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { club } from "@lib/content/club";
import { emailStyles as s } from "../email-styles";

export interface VerificationCodeEmailProps {
  name: string;
  code: string;
  ttlMinutes: number;
}

export function VerificationCodeEmail({
  name,
  code,
  ttlMinutes,
}: VerificationCodeEmailProps) {
  return (
    <Html lang="da">
      <Head />
      <Preview>{`Din kode er ${code}. Den udløber om ${ttlMinutes} minutter.`}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Text style={s.brand}>{club.name}</Text>

          <Heading style={s.heading}>Bekræft din e-mail</Heading>

          <Text style={s.paragraph}>Hej {name},</Text>
          <Text style={s.paragraph}>
            Du er ved at oprette en konto hos {club.name}. Indtast koden
            herunder. Den udløber om {ttlMinutes} minutter.
          </Text>

          <Section style={s.detailBlock}>
            <Text style={s.detailLabel}>Kode</Text>
            <Text style={s.code}>{code}</Text>
          </Section>

          <Text style={s.paragraph}>
            Hvis du ikke har bedt om en konto, kan du se bort fra denne mail.
          </Text>

          <Text style={s.signOff}>
            De bedste hilsner,
            <br />
            {club.name}
          </Text>

          <Hr style={s.hr} />

          <Text style={s.footer}>
            Du modtager denne mail, fordi du bad om en konto hos {club.name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
