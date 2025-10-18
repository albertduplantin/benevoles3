'use client';

import { Calendar, momentLocalizer, Event, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MissionClient, UserClient, User } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils/date';
import { canEditMission, canDeleteMission } from '@/lib/utils/permissions';
import { EditIcon, TrashIcon, EyeIcon } from 'lucide-react';
import './calendar.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

interface MissionCalendarProps {
  missions: MissionClient[];
  currentUserId?: string; // Pour afficher les badges
  currentUser?: User | UserClient | null; // Pour vérifier les permissions
  isAdmin?: boolean; // Pour compatibilité (sera déprécié)
  onDelete?: (missionId: string) => void; // Callback pour la suppression
}

interface CalendarEvent extends Event {
  resource: {
    missionId: string;
    status: string;
    isUrgent: boolean;
    isUserRegistered?: boolean;
    isUserResponsible?: boolean;
  };
}

const messages = {
  allDay: 'Journée',
  previous: 'Précédent',
  next: 'Suivant',
  today: "Aujourd'hui",
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Heure',
  event: 'Événement',
  noEventsInRange: 'Aucune mission dans cette période',
  showMore: (total: number) => `+ ${total} mission(s)`,
};

export function MissionCalendar({ missions, currentUserId, currentUser, isAdmin, onDelete }: MissionCalendarProps) {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedMission, setSelectedMission] = useState<MissionClient | null>(null);

  // Vérifier si l'utilisateur peut éditer/supprimer la mission sélectionnée
  const canUserEdit = selectedMission && currentUser ? canEditMission(currentUser, selectedMission.category) : isAdmin;
  const canUserDelete = selectedMission && currentUser ? canDeleteMission(currentUser, selectedMission.category) : isAdmin;

  // Convertir les missions en événements calendrier
  const events: CalendarEvent[] = missions
    .filter((mission) => mission.type === 'scheduled' && mission.startDate)
    .map((mission) => {
      const isUserRegistered = currentUserId ? mission.volunteers.includes(currentUserId) : false;
      const isUserResponsible = currentUserId ? mission.responsibles.includes(currentUserId) : false;
      
      let title = mission.title;
      if (isUserResponsible) {
        title = `👑 ${title}`;
      } else if (isUserRegistered) {
        title = `✓ ${title}`;
      }

      return {
        title,
        start: new Date(mission.startDate!),
        end: mission.endDate ? new Date(mission.endDate) : new Date(mission.startDate!),
        resource: {
          missionId: mission.id,
          status: mission.status,
          isUrgent: mission.isUrgent,
          isUserRegistered,
          isUserResponsible,
        },
      };
    });

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    let borderColor = 'transparent';
    let borderWidth = '0px';
    
    // Priorité couleur : Responsable > Inscrit > Urgent > Statut
    if (event.resource.isUserResponsible) {
      backgroundColor = '#8b5cf6'; // Violet pour responsable
      borderColor = '#fbbf24'; // Bordure dorée
      borderWidth = '3px';
    } else if (event.resource.isUserRegistered) {
      backgroundColor = '#3b82f6'; // Bleu pour inscrit
      borderColor = '#22c55e'; // Bordure verte
      borderWidth = '2px';
    } else if (event.resource.isUrgent) {
      backgroundColor = '#ef4444'; // Rouge pour urgent
    } else if (event.resource.status === 'full') {
      backgroundColor = '#f97316'; // Orange pour complet
    } else if (event.resource.status === 'completed') {
      backgroundColor = '#22c55e'; // Vert pour terminé
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: `${borderWidth} solid ${borderColor}`,
        display: 'block',
        fontWeight: event.resource.isUserResponsible || event.resource.isUserRegistered ? '600' : 'normal',
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    if (isAdmin) {
      // Pour les admins, ouvrir le modal avec les options
      const mission = missions.find(m => m.id === event.resource.missionId);
      if (mission) {
        setSelectedMission(mission);
      }
    } else {
      // Pour les autres, rediriger directement
      router.push(`/dashboard/missions/${event.resource.missionId}`);
    }
  };

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  return (
    <div className="space-y-4">
      {/* Légende */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6', border: '3px solid #fbbf24' }}></div>
          <span>👑 Responsable</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6', border: '2px solid #22c55e' }}></div>
          <span>✓ Inscrit</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Urgent</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
          <span>Complet</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
          <span>Terminé</span>
        </div>
      </div>

      {/* Calendrier */}
      <div className="h-[600px] bg-white p-4 rounded-lg border">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          messages={messages}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day', 'agenda']}
          popup
          style={{ height: '100%' }}
        />
      </div>
      
      {/* Modal pour les actions rapides */}
      {(canUserEdit || canUserDelete) && selectedMission && (
        <Dialog open={!!selectedMission} onOpenChange={(open) => !open && setSelectedMission(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedMission.title}</DialogTitle>
              <DialogDescription>
                {selectedMission.location} • {selectedMission.startDate && formatDateTime(selectedMission.startDate)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={selectedMission.status === 'published' ? 'default' : 'secondary'}>
                  {selectedMission.status === 'published' && 'Publiée'}
                  {selectedMission.status === 'draft' && 'Brouillon'}
                  {selectedMission.status === 'full' && 'Complète'}
                  {selectedMission.status === 'cancelled' && 'Annulée'}
                  {selectedMission.status === 'completed' && 'Terminée'}
                </Badge>
                {selectedMission.isUrgent && (
                  <Badge variant="destructive">URGENT</Badge>
                )}
                <Badge variant="outline">
                  {selectedMission.volunteers.length}/{selectedMission.maxVolunteers} bénévoles
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3">
                {selectedMission.description}
              </p>
              
              <div className="flex flex-col gap-2 pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    router.push(`/dashboard/missions/${selectedMission.id}`);
                    setSelectedMission(null);
                  }}
                >
                  <EyeIcon className="h-4 w-4" />
                  Voir les détails
                </Button>
                {canUserEdit && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      router.push(`/dashboard/missions/${selectedMission.id}/edit`);
                      setSelectedMission(null);
                    }}
                  >
                    <EditIcon className="h-4 w-4" />
                    Éditer la mission
                  </Button>
                )}
                {canUserDelete && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (onDelete) {
                        onDelete(selectedMission.id);
                        setSelectedMission(null);
                      }
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Supprimer la mission
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

