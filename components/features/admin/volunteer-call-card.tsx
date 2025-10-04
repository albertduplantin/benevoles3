'use client';

import { useState } from 'react';
import { MissionClient } from '@/types';
import {
  generateVolunteerCallMessage,
  generateVolunteerCallHTML,
  getIncompleteMissions,
  getVolunteerCallStats,
} from '@/lib/utils/volunteer-call-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CopyIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';

interface VolunteerCallCardProps {
  missions: MissionClient[];
}

export function VolunteerCallCard({ missions }: VolunteerCallCardProps) {
  const [copied, setCopied] = useState<'text' | 'html' | null>(null);

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
      <Card>
        <CardHeader>
          <CardTitle>Appel aux Bénévoles</CardTitle>
          <CardDescription>Générer un message pour recruter des bénévoles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-lg">
            <CheckIcon className="h-5 w-5" />
            <p className="font-medium">Toutes les missions sont complètes ! 🎉</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Appel aux Bénévoles</CardTitle>
            <CardDescription>
              Générer un message pour recruter des bénévoles pour les missions incomplètes
            </CardDescription>
          </div>
          {stats.urgentMissions > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircleIcon className="h-3 w-3" />
              {stats.urgentMissions} urgente{stats.urgentMissions > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.incompleteMissions}</p>
            <p className="text-xs text-blue-600">Mission{stats.incompleteMissions > 1 ? 's' : ''}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.totalPlacesNeeded}</p>
            <p className="text-xs text-orange-600">Place{stats.totalPlacesNeeded > 1 ? 's' : ''}</p>
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
              📱 Copiez ce texte et collez-le dans WhatsApp, SMS ou tout autre canal de communication
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
      </CardContent>
    </Card>
  );
}

