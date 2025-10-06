'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
      toast.success('Email envoyé !', {
        description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Une erreur est survenue';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
      }
      
      toast.error('Erreur', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email envoyé ✅</CardTitle>
          <CardDescription>
            Un email de réinitialisation a été envoyé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 text-sm bg-green-50 text-green-800 rounded-md">
            <p className="font-medium mb-2">Vérifiez votre boîte mail</p>
            <p>
              Nous vous avons envoyé un lien pour réinitialiser votre mot de passe.
              Si vous ne recevez pas l&apos;email dans quelques minutes, vérifiez vos spams.
            </p>
          </div>

          <div className="text-center space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Retour à la connexion</Link>
            </Button>
            
            <button
              onClick={() => setEmailSent(false)}
              className="text-sm text-primary hover:underline w-full"
            >
              Renvoyer un email
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Mot de passe oublié</CardTitle>
        <CardDescription>
          Entrez votre email pour recevoir un lien de réinitialisation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="jean.dupont@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/auth/login" className="text-primary hover:underline">
            ← Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

