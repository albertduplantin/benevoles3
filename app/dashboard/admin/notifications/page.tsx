'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllVolunteers } from '@/lib/firebase/volunteers';
import { UserClient } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, SendIcon, UsersIcon, MailIcon } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [volunteers, setVolunteers] = useState<UserClient[]>([]);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Formulaire
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [targetAll, setTargetAll] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        setIsLoadingVolunteers(true);
        const fetchedVolunteers = await getAllVolunteers();
        setVolunteers(fetchedVolunteers);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        toast.error('Erreur lors du chargement des bénévoles.');
      } finally {
        setIsLoadingVolunteers(false);
      }
    };

    if (user && user.role === 'admin') {
      loadVolunteers();
    }
  }, [user]);

  const eligibleVolunteers = volunteers.filter(
    (v) => v.consents.communications && v.notificationPreferences?.email
  );

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error('Le sujet et le message sont obligatoires.');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/notifications/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          targetAll,
          sentBy: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      toast.success(`✅ ${data.sent} email(s) envoyé(s) avec succès ! (${data.skipped} ignoré(s))`);
      
      // Réinitialiser le formulaire
      setSubject('');
      setMessage('');
      setCtaText('');
      setCtaUrl('');
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de la notification.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Envoyer une Notification</h1>
        <p className="text-muted-foreground">
          Envoyez un email personnalisé à tous les bénévoles ou à une sélection.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bénévoles</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingVolunteers ? '...' : volunteers.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Activés</CardTitle>
            <MailIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoadingVolunteers ? '...' : eligibleVolunteers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Notifications email actives
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Désactivés</CardTitle>
            <MailIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isLoadingVolunteers ? '...' : volunteers.length - eligibleVolunteers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ne recevront pas l'email
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Composer le message</CardTitle>
          <CardDescription>
            Rédigez votre notification et envoyez-la aux bénévoles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Destinataires */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div>
              <Label htmlFor="target-all" className="text-base font-medium cursor-pointer">
                Envoyer à tous les bénévoles
              </Label>
              <p className="text-sm text-muted-foreground">
                {targetAll
                  ? `L'email sera envoyé à ${eligibleVolunteers.length} bénévole(s)`
                  : 'Sélection personnalisée (non implémenté)'}
              </p>
            </div>
            <Switch
              id="target-all"
              checked={targetAll}
              onCheckedChange={setTargetAll}
              disabled={isSending}
            />
          </div>

          {/* Sujet */}
          <div>
            <Label htmlFor="subject">Sujet de l'email *</Label>
            <Input
              id="subject"
              placeholder="Ex: Rappel important pour le festival"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Rédigez votre message ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              rows={8}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Le message sera affiché tel quel dans l'email.
            </p>
          </div>

          {/* Call-to-Action (optionnel) */}
          <div className="border-t pt-4">
            <Label className="text-base font-medium mb-3 block">
              Bouton d'action (optionnel)
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cta-text">Texte du bouton</Label>
                <Input
                  id="cta-text"
                  placeholder="Ex: Voir les missions"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  disabled={isSending}
                />
              </div>
              <div>
                <Label htmlFor="cta-url">Lien du bouton</Label>
                <Input
                  id="cta-url"
                  placeholder="https://..."
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  disabled={isSending}
                />
              </div>
            </div>
          </div>

          {/* Bouton d'envoi */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSend}
              disabled={isSending || !subject || !message}
              size="lg"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Envoyer aux {eligibleVolunteers.length} bénévole(s)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Avertissement */}
      <Card className="border-yellow-500 bg-yellow-50">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Attention :</strong> Les bénévoles ayant désactivé les notifications email
            dans leur profil ne recevront pas cet email (respecte le RGPD).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

