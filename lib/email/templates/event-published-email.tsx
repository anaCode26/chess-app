import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { club } from "@lib/content/club";
import { emailStyles as s } from "../email-styles";

export interface EventPublishedEmailProps {
  name: string;
  title: string;
  /** Already formatted da-DK in Europe/Copenhagen by the caller. */
  dateLabel: string;
  /** Club notation, e.g. "19.00". Rendered verbatim. */
  startTime: string | null;
  description: string | null;
  eventUrl: string;
  unsubscribeUrl: string;
}

export function EventPublishedEmail({
  name,
  title,
  dateLabel,
  startTime,
  description,
  eventUrl,
  unsubscribeUrl,
}: EventPublishedEmailProps) {
  const details = [
    { label: "Navn", value: title },
    { label: "Dato", value: dateLabel },
    ...(startTime ? [{ label: "Tidspunkt", value: startTime }] : []),
    ...(description ? [{ label: "Om arrangementet", value: description }] : []),
  ];

  return (
    <Html lang="da">
      <Head />
      <Preview>{`Nyt arrangement i ${club.name}: ${title}`}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Text style={s.brand}>{club.name}</Text>

          <Heading style={s.heading}>Nyt arrangement i klubben</Heading>

          <Text style={s.paragraph}>Hej {name},</Text>
          <Text style={s.paragraph}>
            Der er godt nyt! Vi har netop lagt et nyt arrangement i klubbens kalender.
          </Text>

          <Section style={s.detailBlock}>
            {details.map((detail, index) => (
              <div key={detail.label}>
                <Text style={s.detailLabel}>{detail.label}</Text>
                <Text style={index === details.length - 1 ? s.detailValueLast : s.detailValue}>
                  {detail.value}
                </Text>
              </div>
            ))}
          </Section>

          <Text style={s.paragraph}>
            Vil du med til skakbrættet? Klik på knappen nedenfor for at se arrangementet i
            kalenderen.
          </Text>

          <Button href={eventUrl} style={s.button}>
            Se arrangementet i kalenderen
          </Button>

          <Text style={s.signOff}>
            Vi glæder os til at se dig til en masse gode partier!
            <br />
            <br />
            De bedste hilsner,
            <br />
            {club.name}
          </Text>

          <Hr style={s.hr} />

          <Text style={s.footer}>
            Du modtager denne mail, fordi du er medlem af {club.name}.{" "}
            <Link href={unsubscribeUrl} style={s.footerLink}>
              Afmeld beskeder om nye arrangementer.
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
