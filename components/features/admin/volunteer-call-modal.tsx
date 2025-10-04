'use client';

import { useState } from 'react';
import { MissionClient } from '@/types';
import {
  generateVolunteerCallMessage,
  generateVolunteerCallHTML,
  getIncompleteMissions,
  getVolunteerCallStats,
} from '@/lib/utils/volunteer-call-generator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CopyIcon, CheckIcon, AlertCircleIcon, MegaphoneIcon } from 'lucide-react';

interface VolunteerCallModalProps {
  missions: MissionClient[];
}

export function VolunteerCallModal({ missions }: VolunteerCallModalProps) {
  const [copied, setCopied] = useState<'text' | 'html' | null>(null);
  const [open, setOpen] = useState(false);

  const incompleteMissions = getIncompleteMissions(missions);
  const stats = getVolunteerCallStats(missions);
  const textMessage = generateVolunteerCallMessage(incompleteMissions);
  const htmlMessage = generateVolunteerCallHTML(incompleteMissions);

  const handleCopy = async (content: string, type: 'text' | 'html') => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      toast.success('Message copié dans le presse-papier !');
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  if (incompleteMissions.length === 0) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <MegaphoneIcon className="h-4 w-4" />
        Appel aux bénévoles
        <Badge variant="secondary" className="ml-2">
          Toutes complètes
        </Badge>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <MegaphoneIcon className="h-4 w-4" />
          Générer un appel aux bénévoles
          {stats.urgentMissions > 0 && (
            <Badge variant="destructive" className="ml-2 gap-1">
              <AlertCircleIcon className="h-3 w-3" />
              {stats.urgentMissions}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appel aux Bénévoles</DialogTitle>
          <DialogDescription>
            Générer un message pour recruter des bénévoles pour les missions incomplètes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.incompleteMissions}</p>
              <p className="text-xs text-blue-600">
                Mission{stats.incompleteMissions > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.totalPlacesNeeded}</p>
              <p className="text-xs text-orange-600">
                Place{stats.totalPlacesNeeded > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{stats.urgentMissions}</p>
              <p className="text-xs text-red-600">Urgent{stats.urgentMissions > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Messages */}
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">WhatsApp / SMS</TabsTrigger>
              <TabsTrigger value="html">Email (HTML)</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-3">
              <div className="relative">
                <pre className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap max-h-96 overflow-y-auto border">
                  {textMessage}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(textMessage, 'text')}
                >
                  {copied === 'text' ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copier
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                📱 Copiez ce texte et collez-le dans WhatsApp, SMS ou tout autre canal de
                communication
              </p>
            </TabsContent>

            <TabsContent value="html" className="space-y-3">
              <div className="relative">
                <div
                  className="p-4 bg-white rounded-lg border max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: htmlMessage }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(htmlMessage, 'html')}
                >
                  {copied === 'html' ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copier
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                📧 Copiez ce HTML et collez-le dans votre client email ou plateforme d'envoi
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

