'use client';

import { useState } from 'react';
import { MissionClient } from '@/types';
import {
  generateVolunteerCallMessage,
  generateVolunteerCallMessageHTML,
  getIncompleteMissions,
} from '@/lib/utils/message-generator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, Copy, Check, Mail, MessageCircle } from 'lucide-react';

interface VolunteerCallGeneratorProps {
  missions: MissionClient[];
}

export function VolunteerCallGenerator({ missions }: VolunteerCallGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHTML, setCopiedHTML] = useState(false);

  const incompleteMissions = getIncompleteMissions(missions);
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://benevoles3.vercel.app';

  const textMessage = generateVolunteerCallMessage(incompleteMissions, baseUrl);
  const htmlMessage = generateVolunteerCallMessageHTML(incompleteMissions, baseUrl);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(htmlMessage);
      setCopiedHTML(true);
      setTimeout(() => setCopiedHTML(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="gap-2">
          <Megaphone className="h-5 w-5" />
          Générer appel aux bénévoles
          {incompleteMissions.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {incompleteMissions.length} mission{incompleteMissions.length > 1 ? 's' : ''}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Megaphone className="h-6 w-6" />
            Générer un appel aux bénévoles
          </DialogTitle>
          <DialogDescription>
            Créez un message engageant pour recruter des bénévoles sur les missions incomplètes.
            Copiez le texte et partagez-le sur WhatsApp, par email ou sur les réseaux sociaux !
          </DialogDescription>
        </DialogHeader>

        {incompleteMissions.length === 0 ? (
          <div className="py-8 text-center">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Toutes les missions sont complètes !</h3>
            <p className="text-gray-600">
              Aucun appel aux bénévoles nécessaire pour le moment. 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-semibold text-blue-900">
                  {incompleteMissions.length} mission{incompleteMissions.length > 1 ? 's' : ''}{' '}
                  nécessite{incompleteMissions.length > 1 ? 'nt' : ''} des bénévoles
                </p>
                <p className="text-sm text-blue-700">
                  {incompleteMissions.reduce(
                    (acc, m) => acc + (m.maxVolunteers - m.volunteers.length),
                    0
                  )}{' '}
                  bénévole(s) recherché(s) au total
                </p>
              </div>
              {incompleteMissions.some((m) => m.isUrgent) && (
                <Badge variant="destructive" className="gap-1">
                  🔴 Missions urgentes
                </Badge>
              )}
            </div>

            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp / SMS
                </TabsTrigger>
                <TabsTrigger value="html" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email (HTML)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans text-sm max-h-[400px] overflow-y-auto">
                    {textMessage}
                  </pre>
                  <Button
                    onClick={handleCopyText}
                    className="absolute top-2 right-2 gap-2"
                    size="sm"
                  >
                    {copiedText ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier le texte
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  💡 Ce format est idéal pour WhatsApp, SMS, ou les réseaux sociaux. Les liens
                  sont cliquables !
                </p>
              </TabsContent>

              <TabsContent value="html" className="space-y-4">
                <div className="relative">
                  <div
                    className="p-4 bg-white rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: htmlMessage }}
                  />
                  <Button
                    onClick={handleCopyHTML}
                    className="absolute top-2 right-2 gap-2"
                    size="sm"
                  >
                    {copiedHTML ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier le HTML
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  💡 Ce format HTML est parfait pour les emails. Copiez le code et collez-le dans
                  votre client email (Gmail, Outlook, etc.)
                </p>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => setOpen(false)} variant="outline" className="flex-1">
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

