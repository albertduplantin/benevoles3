'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resetPassword } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'envoi de l\'email');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">Email envoyé !</CardTitle>
          <CardDescription className="text-center">
            Un email de réinitialisation a été envoyé à <strong>{getValues('email')}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-900">
              <strong>Que faire maintenant ?</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Consultez votre boîte email</li>
              <li>Cliquez sur le lien de réinitialisation</li>
              <li>Choisissez votre nouveau mot de passe</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-900">
              <strong>💡 Vous ne voyez pas l&apos;email ?</strong>
            </p>
            <ul className="text-sm text-amber-800 mt-2 space-y-1 list-disc list-inside">
              <li>Vérifiez votre dossier <strong>SPAM / Indésirables</strong></li>
              <li>Cherchez un email de &quot;Festival Films Courts&quot;</li>
              <li>Si vous le trouvez, marquez-le comme &quot;Non spam&quot;</li>
            </ul>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou
            <button
              onClick={() => {
                setSuccess(false);
                setIsLoading(false);
              }}
              className="ml-1 text-primary underline hover:no-underline"
            >
              réessayez
            </button>
          </div>

          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center">Mot de passe oublié ?</CardTitle>
        <CardDescription className="text-center">
          Pas de problème ! Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="votre.email@exemple.com"
              disabled={isLoading}
              autoFocus
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </Button>
        </form>

        <Link href="/auth/login" className="block">
          <Button variant="ghost" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
