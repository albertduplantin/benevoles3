import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/features/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Réinitialiser le mot de passe',
  description: 'Réinitialisez votre mot de passe',
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  );
}
