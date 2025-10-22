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

      // ============================================
      // EN-TÊTE
      // ============================================
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('🎬 Rapport Post-Festival', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Festival Films Courts de Dinan', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 6;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', { 
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
      doc.text('📊 Vue d\'ensemble', 14, yPosition);
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
      doc.text('📂 Répartition par Catégorie', 14, yPosition);
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
      doc.text('🏆 Top 15 Bénévoles les Plus Actifs', 14, yPosition);
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
        doc.text(`🚨 Missions Urgentes (${urgentMissions.length})`, 14, yPosition);
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
      doc.text('📋 Répartition par Statut', 14, yPosition);
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

