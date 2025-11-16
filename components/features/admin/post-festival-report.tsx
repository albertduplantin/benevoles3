'use client';

import { Button } from '@/components/ui/button';
import { MissionClient, UserClient } from '@/types';
import { FileTextIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface PostFestivalReportProps {
  missions: MissionClient[];
  allVolunteers: Map<string, UserClient>;
}

export function PostFestivalReport({ missions, allVolunteers }: PostFestivalReportProps) {
  const generateReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Helper pour ajouter une nouvelle page si nécessaire
      const checkAddPage = (requiredSpace: number = 50) => {
        if (yPosition > 280 - requiredSpace) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // ============================================
      // EN-TÊTE
      // ============================================
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT POST-FESTIVAL', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Festival Films Courts de Dinan', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      doc.setTextColor(0, 0, 0);

      // ============================================
      // SECTION 1 : VUE D'ENSEMBLE
      // ============================================
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('1. VUE D\'ENSEMBLE', 14, yPosition);
      yPosition += 10;

      // Calculs statistiques
      const totalMissions = missions.length;
      const publishedMissions = missions.filter(m => m.status === 'published' || m.status === 'full').length;
      const completedMissions = missions.filter(m => m.status === 'completed').length;
      const cancelledMissions = missions.filter(m => m.status === 'cancelled').length;
      
      const uniqueVolunteers = new Set(missions.flatMap(m => m.volunteers));
      const totalVolunteers = uniqueVolunteers.size;
      
      const totalSlots = missions.reduce((sum, m) => sum + m.maxVolunteers, 0);
      const filledSlots = missions.reduce((sum, m) => sum + m.volunteers.length, 0);
      const fillRate = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

      // Calcul heures totales
      let totalHours = 0;
      missions.forEach(mission => {
        if (mission.startDate && mission.endDate) {
          const hours = (new Date(mission.endDate).getTime() - new Date(mission.startDate).getTime()) / (1000 * 60 * 60);
          totalHours += hours * mission.volunteers.length;
        }
      });

      const overviewData = [
        ['Total missions créées', totalMissions.toString()],
        ['Missions publiées', publishedMissions.toString()],
        ['Missions terminées', completedMissions.toString()],
        ['Missions annulées', cancelledMissions.toString()],
        ['', ''],
        ['Bénévoles mobilisés', totalVolunteers.toString()],
        ['Places offertes', totalSlots.toString()],
        ['Places remplies', filledSlots.toString()],
        ['Taux de remplissage', `${fillRate}%`],
        ['', ''],
        ['Heures de bénévolat (estimé)', `${Math.round(totalHours)}h`],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Indicateur', 'Valeur']],
        body: overviewData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], fontSize: 10, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 120 },
          1: { halign: 'right', cellWidth: 50 }
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // ============================================
      // SECTION 2 : RÉPARTITION PAR CATÉGORIE
      // ============================================
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('2. REPARTITION PAR CATEGORIE', 14, yPosition);
      yPosition += 10;

      // Calculer stats par catégorie
      const categoryStats = new Map<string, { missions: number; volunteers: Set<string>; slots: number; filled: number }>();
      
      missions.forEach(mission => {
        const category = mission.category || 'Non catégorisé';
        if (!categoryStats.has(category)) {
          categoryStats.set(category, { missions: 0, volunteers: new Set(), slots: 0, filled: 0 });
        }
        const stats = categoryStats.get(category)!;
        stats.missions++;
        stats.slots += mission.maxVolunteers;
        stats.filled += mission.volunteers.length;
        mission.volunteers.forEach(v => stats.volunteers.add(v));
      });

      const categoryData = Array.from(categoryStats.entries())
        .map(([category, stats]) => [
          category,
          stats.missions.toString(),
          stats.volunteers.size.toString(),
          `${stats.filled}/${stats.slots}`,
          stats.slots > 0 ? `${Math.round((stats.filled / stats.slots) * 100)}%` : '0%'
        ])
        .sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

      autoTable(doc, {
        startY: yPosition,
        head: [['Catégorie', 'Missions', 'Bénévoles', 'Places', 'Taux']],
        body: categoryData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // ============================================
      // SECTION 3 : TOP 15 BÉNÉVOLES
      // ============================================
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('3. TOP 15 BENEVOLES LES PLUS ACTIFS', 14, yPosition);
      yPosition += 10;

      // Compter missions par bénévole
      const volunteerCounts = new Map<string, number>();
      missions.forEach(mission => {
        mission.volunteers.forEach(volunteerId => {
          volunteerCounts.set(volunteerId, (volunteerCounts.get(volunteerId) || 0) + 1);
        });
      });

      // Top 15
      const topVolunteers = Array.from(volunteerCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([volunteerId, count], index) => {
          const volunteer = allVolunteers.get(volunteerId);
          const name = volunteer 
            ? `${volunteer.firstName} ${volunteer.lastName}`
            : 'Bénévole inconnu';
          return [
            (index + 1).toString(),
            name,
            count.toString()
          ];
        });

      if (topVolunteers.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Nom', 'Missions']],
          body: topVolunteers,
          theme: 'grid',
          headStyles: { fillColor: [0, 0, 0], fontSize: 9, fontStyle: 'bold' },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 120 },
            2: { halign: 'center', cellWidth: 25 }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Aucun bénévole inscrit', 14, yPosition);
        yPosition += 15;
      }

      // ============================================
      // SECTION 4 : MISSIONS URGENTES
      // ============================================
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      const urgentMissions = missions.filter(m => m.isUrgent);
      if (urgentMissions.length > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`4. MISSIONS URGENTES (${urgentMissions.length})`, 14, yPosition);
        yPosition += 10;

        const urgentData = urgentMissions.map(mission => [
          mission.title,
          mission.category || 'N/A',
          `${mission.volunteers.length}/${mission.maxVolunteers}`,
          mission.status === 'full' ? 'Complète' : 
          mission.status === 'published' ? 'Publiée' : 
          mission.status === 'completed' ? 'Terminée' : 'Autre'
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Mission', 'Catégorie', 'Bénévoles', 'Statut']],
          body: urgentData,
          theme: 'grid',
          headStyles: { fillColor: [220, 38, 38], fontSize: 9, fontStyle: 'bold' },
          styles: { fontSize: 8, cellPadding: 2 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // ============================================
      // SECTION 5 : STATUT DES MISSIONS
      // ============================================
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('5. REPARTITION PAR STATUT', 14, yPosition);
      yPosition += 10;

      const statusCounts = {
        draft: missions.filter(m => m.status === 'draft').length,
        published: missions.filter(m => m.status === 'published').length,
        full: missions.filter(m => m.status === 'full').length,
        completed: missions.filter(m => m.status === 'completed').length,
        cancelled: missions.filter(m => m.status === 'cancelled').length,
      };

      const statusData = [
        ['Brouillon', statusCounts.draft.toString()],
        ['Publiée', statusCounts.published.toString()],
        ['Complète', statusCounts.full.toString()],
        ['Terminée', statusCounts.completed.toString()],
        ['Annulée', statusCounts.cancelled.toString()],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Statut', 'Nombre']],
        body: statusData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], fontSize: 10, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 120 },
          1: { halign: 'right', cellWidth: 50 }
        }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // ============================================
      // SECTION 6 : ANALYSE DES BÉNÉVOLES
      // ============================================
      checkAddPage();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('6. ANALYSE DES BENEVOLES', 14, yPosition);
      yPosition += 10;

      // Calcul des statistiques des bénévoles
      const volunteerStats = new Map<string, { missions: number; hours: number; categories: Set<string> }>();
      
      missions.forEach(mission => {
        mission.volunteers.forEach(volunteerId => {
          if (!volunteerStats.has(volunteerId)) {
            volunteerStats.set(volunteerId, { missions: 0, hours: 0, categories: new Set() });
          }
          const stats = volunteerStats.get(volunteerId)!;
          stats.missions++;
          if (mission.category) stats.categories.add(mission.category);
          
          if (mission.startDate && mission.endDate) {
            const hours = (new Date(mission.endDate).getTime() - new Date(mission.startDate).getTime()) / (1000 * 60 * 60);
            stats.hours += hours;
          }
        });
      });

      // Analyse de la participation
      const volunteerMissionCounts = Array.from(volunteerStats.values()).map(s => s.missions);
      const avgMissionsPerVolunteer = volunteerMissionCounts.length > 0 
        ? (volunteerMissionCounts.reduce((a, b) => a + b, 0) / volunteerMissionCounts.length).toFixed(1)
        : '0';
      
      const volunteersWith1Mission = volunteerMissionCounts.filter(c => c === 1).length;
      const volunteersWith2to5Missions = volunteerMissionCounts.filter(c => c >= 2 && c <= 5).length;
      const volunteersWith6to10Missions = volunteerMissionCounts.filter(c => c >= 6 && c <= 10).length;
      const volunteersWithMore10Missions = volunteerMissionCounts.filter(c => c > 10).length;

      const avgHoursPerVolunteer = volunteerStats.size > 0
        ? (Array.from(volunteerStats.values()).reduce((sum, s) => sum + s.hours, 0) / volunteerStats.size).toFixed(1)
        : '0';

      const volunteerAnalysisData = [
        ['Bénévoles uniques', totalVolunteers.toString()],
        ['Missions moyenne par bénévole', avgMissionsPerVolunteer],
        ['Heures moyenne par bénévole', `${avgHoursPerVolunteer}h`],
        ['', ''],
        ['Bénévoles avec 1 mission', volunteersWith1Mission.toString()],
        ['Bénévoles avec 2-5 missions', volunteersWith2to5Missions.toString()],
        ['Bénévoles avec 6-10 missions', volunteersWith6to10Missions.toString()],
        ['Bénévoles avec +10 missions', volunteersWithMore10Missions.toString()],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Indicateur', 'Valeur']],
        body: volunteerAnalysisData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 10, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 120 },
          1: { halign: 'right', cellWidth: 50 }
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // ============================================
      // SECTION 7 : MISSIONS LES PLUS POPULAIRES
      // ============================================
      checkAddPage();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('7. TOP 10 MISSIONS LES PLUS POPULAIRES', 14, yPosition);
      yPosition += 10;

      const popularMissions = [...missions]
        .sort((a, b) => b.volunteers.length - a.volunteers.length)
        .slice(0, 10)
        .map((mission, index) => [
          (index + 1).toString(),
          mission.title.substring(0, 50) + (mission.title.length > 50 ? '...' : ''),
          mission.volunteers.length.toString(),
          `${mission.volunteers.length}/${mission.maxVolunteers}`,
          mission.maxVolunteers > 0 ? `${Math.round((mission.volunteers.length / mission.maxVolunteers) * 100)}%` : '0%'
        ]);

      if (popularMissions.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Mission', 'Bénévoles', 'Places', 'Taux']],
          body: popularMissions,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], fontSize: 9, fontStyle: 'bold' },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'center', cellWidth: 25 },
            3: { halign: 'center', cellWidth: 25 },
            4: { halign: 'center', cellWidth: 20 }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // ============================================
      // SECTION 8 : ANALYSE TEMPORELLE
      // ============================================
      checkAddPage();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('8. ANALYSE TEMPORELLE', 14, yPosition);
      yPosition += 10;

      // Missions par jour de la semaine
      const dayStats = new Map<string, { missions: number; volunteers: number }>();
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      
      missions.forEach(mission => {
        if (mission.startDate) {
          const day = new Date(mission.startDate).getDay();
          const dayName = dayNames[day];
          if (!dayStats.has(dayName)) {
            dayStats.set(dayName, { missions: 0, volunteers: 0 });
          }
          const stats = dayStats.get(dayName)!;
          stats.missions++;
          stats.volunteers += mission.volunteers.length;
        }
      });

      const dayData = dayNames
        .map(day => {
          const stats = dayStats.get(day) || { missions: 0, volunteers: 0 };
          return [
            day,
            stats.missions.toString(),
            stats.volunteers.toString(),
            stats.missions > 0 ? (stats.volunteers / stats.missions).toFixed(1) : '0'
          ];
        })
        .filter(row => parseInt(row[1]) > 0);

      if (dayData.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['Jour', 'Missions', 'Bénévoles', 'Moy./Mission']],
          body: dayData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], fontSize: 9, fontStyle: 'bold' },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // ============================================
      // SECTION 9 : CRÉNEAUX HORAIRES
      // ============================================
      checkAddPage();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('9. REPARTITION PAR CRENEAUX HORAIRES', 14, yPosition);
      yPosition += 10;

      const timeSlots = new Map<string, number>();
      missions.forEach(mission => {
        if (mission.startDate) {
          const hour = new Date(mission.startDate).getHours();
          let slot = '';
          if (hour < 8) slot = 'Nuit (00h-08h)';
          else if (hour < 12) slot = 'Matin (08h-12h)';
          else if (hour < 14) slot = 'Midi (12h-14h)';
          else if (hour < 18) slot = 'Après-midi (14h-18h)';
          else if (hour < 22) slot = 'Soirée (18h-22h)';
          else slot = 'Nuit (22h-00h)';
          
          timeSlots.set(slot, (timeSlots.get(slot) || 0) + 1);
        }
      });

      const timeSlotData = [
        ['Nuit (00h-08h)', (timeSlots.get('Nuit (00h-08h)') || 0).toString()],
        ['Matin (08h-12h)', (timeSlots.get('Matin (08h-12h)') || 0).toString()],
        ['Midi (12h-14h)', (timeSlots.get('Midi (12h-14h)') || 0).toString()],
        ['Après-midi (14h-18h)', (timeSlots.get('Après-midi (14h-18h)') || 0).toString()],
        ['Soirée (18h-22h)', (timeSlots.get('Soirée (18h-22h)') || 0).toString()],
        ['Nuit (22h-00h)', (timeSlots.get('Nuit (22h-00h)') || 0).toString()],
      ].filter(row => parseInt(row[1]) > 0);

      if (timeSlotData.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['Créneau', 'Missions']],
          body: timeSlotData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], fontSize: 10, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 120 },
            1: { halign: 'right', cellWidth: 50 }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // ============================================
      // SECTION 10 : MISSIONS INCOMPLÈTES
      // ============================================
      checkAddPage();

      const incompleteMissions = missions.filter(m => 
        (m.status === 'published' || m.status === 'draft') && 
        m.volunteers.length < m.maxVolunteers
      );

      if (incompleteMissions.length > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`10. MISSIONS INCOMPLETES (${incompleteMissions.length})`, 14, yPosition);
        yPosition += 10;

        const incompleteData = incompleteMissions
          .sort((a, b) => {
            const aRate = a.maxVolunteers > 0 ? a.volunteers.length / a.maxVolunteers : 0;
            const bRate = b.maxVolunteers > 0 ? b.volunteers.length / b.maxVolunteers : 0;
            return aRate - bRate;
          })
          .slice(0, 15)
          .map(mission => [
            mission.title.substring(0, 50) + (mission.title.length > 50 ? '...' : ''),
            mission.category || 'N/A',
            `${mission.volunteers.length}/${mission.maxVolunteers}`,
            `${mission.maxVolunteers - mission.volunteers.length}`,
            mission.maxVolunteers > 0 ? `${Math.round((mission.volunteers.length / mission.maxVolunteers) * 100)}%` : '0%'
          ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Mission', 'Catégorie', 'Rempli', 'Manque', 'Taux']],
          body: incompleteData,
          theme: 'grid',
          headStyles: { fillColor: [234, 179, 8], fontSize: 9, fontStyle: 'bold' },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            2: { halign: 'center', cellWidth: 25 },
            3: { halign: 'center', cellWidth: 25 },
            4: { halign: 'center', cellWidth: 20 }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // ============================================
      // SECTION 11 : BÉNÉVOLES POLYVALENTS
      // ============================================
      checkAddPage();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('11. BENEVOLES LES PLUS POLYVALENTS', 14, yPosition);
      yPosition += 10;

      const polyvalentVolunteers = Array.from(volunteerStats.entries())
        .map(([volunteerId, stats]) => ({
          volunteerId,
          categoriesCount: stats.categories.size,
          missionsCount: stats.missions,
          categories: Array.from(stats.categories).join(', ')
        }))
        .filter(v => v.categoriesCount > 1)
        .sort((a, b) => b.categoriesCount - a.categoriesCount)
        .slice(0, 10)
        .map((v, index) => {
          const volunteer = allVolunteers.get(v.volunteerId);
          const name = volunteer 
            ? `${volunteer.firstName} ${volunteer.lastName}`
            : 'Inconnu';
          return [
            (index + 1).toString(),
            name,
            v.missionsCount.toString(),
            v.categoriesCount.toString(),
            v.categories.substring(0, 60) + (v.categories.length > 60 ? '...' : '')
          ];
        });

      if (polyvalentVolunteers.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Nom', 'Missions', 'Catég.', 'Catégories']],
          body: polyvalentVolunteers,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], fontSize: 9, fontStyle: 'bold' },
          styles: { fontSize: 7, cellPadding: 2 },
          columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'center', cellWidth: 20 }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Aucun bénévole n\'a participé à plusieurs catégories', 14, yPosition);
        yPosition += 15;
      }

      // ============================================
      // SECTION 12 : DURÉE DES MISSIONS
      // ============================================
      checkAddPage();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('12. ANALYSE DE LA DUREE DES MISSIONS', 14, yPosition);
      yPosition += 10;

      const missionsWithDuration = missions.filter(m => m.startDate && m.endDate);
      const durations = missionsWithDuration.map(m => 
        (new Date(m.endDate!).getTime() - new Date(m.startDate!).getTime()) / (1000 * 60 * 60)
      );

      if (durations.length > 0) {
        const avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
        const minDuration = Math.min(...durations).toFixed(1);
        const maxDuration = Math.max(...durations).toFixed(1);
        
        const shortMissions = durations.filter(d => d < 2).length;
        const mediumMissions = durations.filter(d => d >= 2 && d <= 4).length;
        const longMissions = durations.filter(d => d > 4).length;

        const durationData = [
          ['Durée moyenne', `${avgDuration}h`],
          ['Durée minimale', `${minDuration}h`],
          ['Durée maximale', `${maxDuration}h`],
          ['', ''],
          ['Missions courtes (< 2h)', shortMissions.toString()],
          ['Missions moyennes (2h-4h)', mediumMissions.toString()],
          ['Missions longues (> 4h)', longMissions.toString()],
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Indicateur', 'Valeur']],
          body: durationData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], fontSize: 10, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 120 },
            1: { halign: 'right', cellWidth: 50 }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // ============================================
      // SECTION 13 : RÉCAPITULATIF FINAL
      // ============================================
      checkAddPage(60);

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('13. RECAPITULATIF FINAL', 14, yPosition);
      yPosition += 10;

      const volunteerEngagementRate = totalVolunteers > 0 && allVolunteers.size > 0
        ? Math.round((totalVolunteers / allVolunteers.size) * 100)
        : 0;

      const completionRate = totalMissions > 0
        ? Math.round((completedMissions / totalMissions) * 100)
        : 0;

      const recapData = [
        ['📊 MISSIONS', ''],
        ['Total missions', totalMissions.toString()],
        ['Taux de complétion', `${completionRate}%`],
        ['Taux de remplissage moyen', `${fillRate}%`],
        ['', ''],
        ['👥 BÉNÉVOLES', ''],
        ['Bénévoles mobilisés', totalVolunteers.toString()],
        ['Missions moy. par bénévole', avgMissionsPerVolunteer],
        ['Heures moy. par bénévole', `${avgHoursPerVolunteer}h`],
        ['', ''],
        ['⏱️ TEMPS', ''],
        ['Total heures bénévolat', `${Math.round(totalHours)}h`],
        ['Équivalent jours (8h)', `${Math.round(totalHours / 8)} jours`],
        ['', ''],
        ['✅ PERFORMANCE', ''],
        ['Missions urgentes', urgentMissions.length.toString()],
        ['Missions incomplètes', incompleteMissions.length.toString()],
        ['Catégories actives', categoryStats.size.toString()],
      ];

      autoTable(doc, {
        startY: yPosition,
        body: recapData,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 120 },
          1: { halign: 'right', cellWidth: 50 }
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // ============================================
      // PIED DE PAGE
      // ============================================
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} / ${totalPages}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Sauvegarder le PDF
      const filename = `rapport-festival-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('Rapport généré avec succès !');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erreur lors de la génération du rapport');
    }
  };

  return (
    <Button 
      onClick={generateReport}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
    >
      <FileTextIcon className="h-4 w-4 mr-2" />
      Générer le Rapport Post-Festival
    </Button>
  );
}

