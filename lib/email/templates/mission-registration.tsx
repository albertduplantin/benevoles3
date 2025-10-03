import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface MissionRegistrationEmailProps {
  volunteerName: string;
  missionTitle: string;
  missionLocation: string;
  missionDate: string;
  missionTime: string;
  missionUrl: string;
}

export const MissionRegistrationEmail = ({
  volunteerName = 'Bénévole',
  missionTitle = 'Mission',
  missionLocation = 'Lieu',
  missionDate = 'Date',
  missionTime = 'Heure',
  missionUrl = '#',
}: MissionRegistrationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmation d'inscription - {missionTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎬 Festival Films Courts de Dinan 2025</Heading>
          <Text style={text}>Bonjour {volunteerName},</Text>
          <Text style={text}>
            Votre inscription à la mission suivante a bien été confirmée :
          </Text>
          
          <Section style={missionBox}>
            <Heading as="h2" style={h2}>
              {missionTitle}
            </Heading>
            <Text style={missionDetail}>
              📍 <strong>Lieu :</strong> {missionLocation}
            </Text>
            <Text style={missionDetail}>
              📅 <strong>Date :</strong> {missionDate}
            </Text>
            <Text style={missionDetail}>
              🕐 <strong>Heure :</strong> {missionTime}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Link style={button} href={missionUrl}>
              Voir les détails de la mission
            </Link>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            Merci pour votre engagement ! 🙌
            <br />
            <br />
            Si vous avez des questions, n'hésitez pas à contacter l'équipe
            d'organisation.
          </Text>
          
          <Text style={footerSmall}>
            Festival Films Courts de Dinan 2025
            <br />
            19-23 Novembre 2025
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MissionRegistrationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 20px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#3b82f6',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 20px',
};

const missionBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 20px',
};

const missionDetail = {
  color: '#1f2937',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const buttonContainer = {
  padding: '27px 20px 27px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 20px',
};

const footerSmall = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 20px',
  textAlign: 'center' as const,
  marginTop: '20px',
};

