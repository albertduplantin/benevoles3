'use client';

import { MissionClient } from '@/types';
import { Button } from '@/components/ui/button';
import { MessageCircleIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/date';

interface WhatsAppShareButtonProps {
  mission: MissionClient;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function WhatsAppShareButton({
  mission,
  variant = 'outline',
  size = 'sm',
  showLabel = true,
}: WhatsAppShareButtonProps) {
  const handleShare = () => {
    // Construire l'URL de la mission
    const missionUrl = `${window.location.origin}/dashboard/missions/${mission.id}`;

    // Calculer places restantes
    const placesRestantes = mission.maxVolunteers - mission.volunteers.length;

    // Construire le message WhatsApp
    const message = `🎬 Festival Films Courts de Dinan 🎬

Rejoins-moi pour cette mission bénévole !

📍 Mission : ${mission.title}
${mission.startDate ? `📅 ${formatDateTime(mission.startDate)}` : '📅 Mission au long cours'}
📍 Lieu : ${mission.location}
👥 ${placesRestantes} place${placesRestantes > 1 ? 's' : ''} restante${placesRestantes > 1 ? 's' : ''}${mission.isUrgent ? ' - 🚨 URGENT' : ''}

Inscris-toi ici : ${missionUrl}`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);

    // Construire l'URL WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className="gap-2"
      title="Partager sur WhatsApp"
    >
      <MessageCircleIcon className="h-4 w-4 text-green-600" />
      {showLabel && <span>Partager</span>}
    </Button>
  );
}

