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

interface CustomAnnouncementEmailProps {
  subject: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const CustomAnnouncementEmail = ({
  subject = 'Annonce importante',
  message = '',
  ctaText,
  ctaUrl,
}: CustomAnnouncementEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎬 Festival Films Courts de Dinan 2025</Heading>
          
          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>

          {ctaText && ctaUrl && (
            <Section style={buttonContainer}>
              <Link style={button} href={ctaUrl}>
                {ctaText}
              </Link>
            </Section>
          )}

          <Hr style={hr} />
          
          <Text style={footer}>
            Merci pour votre engagement ! 💙
            <br />
            <br />
            L'équipe d'organisation du Festival
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

export default CustomAnnouncementEmail;

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

const messageBox = {
  backgroundColor: '#eff6ff',
  borderLeft: '4px solid #3b82f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 20px',
};

const messageText = {
  color: '#1f2937',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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

