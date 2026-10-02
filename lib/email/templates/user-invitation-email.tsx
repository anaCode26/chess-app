import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { club } from "@lib/content/club";
import { emailStyles as s } from "../email-styles";

export interface UserInvitationEmailProps {
  name: string;
  activationUrl: string;
}

export function UserInvitationEmail({
  name,
  activationUrl,
}: UserInvitationEmailProps) {
  return (
    <Html lang="da">
      <Head />
      <Preview>{`Aktivér din konto hos ${club.name}`}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Text style={s.brand}>{club.name}</Text>

          <Heading style={s.heading}>Aktivér din konto</Heading>

          <Text style={s.paragraph}>Hej {name},</Text>
          <Text style={s.paragraph}>
            Der er oprettet en konto til dig hos {club.name}. Vælg en
            adgangskode for at aktivere den. Linket udløber om 72 timer.
          </Text>

          <Button href={activationUrl} style={s.button}>
            Aktivér kontoen
          </Button>

          <Text style={s.signOff}>
            De bedste hilsner,
            <br />
            {club.name}
          </Text>

          <Hr style={s.hr} />

          <Text style={s.footer}>
            Du modtager denne mail, fordi en fra klubben har oprettet en konto
            til dig.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
