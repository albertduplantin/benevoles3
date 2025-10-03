'use client';

import { Calendar, momentLocalizer, Event, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MissionClient } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import './calendar.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

interface MissionCalendarProps {
  missions: MissionClient[];
  currentUserId?: string; // Pour afficher les badges
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

export function MissionCalendar({ missions, currentUserId }: MissionCalendarProps) {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('month');

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
    router.push(`/dashboard/missions/${event.resource.missionId}`);
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
    </div>
  );
}

