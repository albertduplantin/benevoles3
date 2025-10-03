import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MissionClient, UserClient } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Génère un PDF avec la liste des bénévoles d'une mission
 */
export async function exportMissionVolunteersPDF(
  mission: MissionClient,
  volunteers: UserClient[]
) {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.text('Festival Films Courts de Dinan 2025', 105, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.text(`Mission: ${mission.title}`, 105, 30, { align: 'center' });

  // Informations de la mission
  doc.setFontSize(10);
  let yPos = 45;

  if (mission.startDate) {
    const dateStr = format(new Date(mission.startDate), "EEEE d MMMM yyyy 'à' HH'h'mm", {
      locale: fr,
    });
    doc.text(`Date: ${dateStr}`, 20, yPos);
    yPos += 7;
  }

  doc.text(`Lieu: ${mission.location}`, 20, yPos);
  yPos += 7;

  doc.text(
    `Bénévoles: ${volunteers.length} / ${mission.maxVolunteers}`,
    20,
    yPos
  );
  yPos += 7;

  doc.text(`Statut: ${getStatusLabel(mission.status)}`, 20, yPos);
  yPos += 15;

  // Tableau des bénévoles
  const tableData = volunteers.map((volunteer) => [
    `${volunteer.firstName} ${volunteer.lastName}`,
    volunteer.email,
    volunteer.phone || 'N/A',
    getRoleLabel(volunteer.role),
  ]);

  autoTable(doc, {
    head: [['Nom', 'Email', 'Téléphone', 'Rôle']],
    body: tableData,
    startY: yPos,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Pied de page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
      20,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }

  // Télécharger le PDF
  const fileName = `mission-${mission.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-benevoles.pdf`;
  doc.save(fileName);
}

/**
 * Génère un PDF avec le rapport complet d'une mission
 */
export async function exportMissionReportPDF(
  mission: MissionClient,
  volunteers: UserClient[],
  responsibles: UserClient[]
) {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.text('Festival Films Courts de Dinan 2025', 105, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.text('Rapport de Mission', 105, 30, { align: 'center' });

  // Titre de la mission
  doc.setFontSize(14);
  doc.text(mission.title, 105, 45, { align: 'center' });

  let yPos = 60;

  // Section Informations Générales
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations Générales', 20, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  if (mission.startDate) {
    const dateStr = format(new Date(mission.startDate), "EEEE d MMMM yyyy 'à' HH'h'mm", {
      locale: fr,
    });
    doc.text(`Date: ${dateStr}`, 25, yPos);
    yPos += 7;
  }

  doc.text(`Lieu: ${mission.location}`, 25, yPos);
  yPos += 7;

  doc.text(`Statut: ${getStatusLabel(mission.status)}`, 25, yPos);
  yPos += 7;

  doc.text(`Type: ${mission.type === 'scheduled' ? 'Planifiée' : 'Ponctuelle'}`, 25, yPos);
  yPos += 7;

  if (mission.isUrgent) {
    doc.setTextColor(239, 68, 68);
    doc.text('🔴 Mission Urgente', 25, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 7;
  }

  if (mission.isRecurrent) {
    doc.text('🔄 Mission Récurrente', 25, yPos);
    yPos += 7;
  }

  yPos += 5;

  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 20, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const descriptionLines = doc.splitTextToSize(mission.description, 170);
  doc.text(descriptionLines, 25, yPos);
  yPos += descriptionLines.length * 7 + 10;

  // Section Responsables
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Responsables de Mission', 20, yPos);
  yPos += 10;

  if (responsibles.length > 0) {
    const responsiblesData = responsibles.map((resp) => [
      `${resp.firstName} ${resp.lastName}`,
      resp.email,
      resp.phone || 'N/A',
    ]);

    autoTable(doc, {
      head: [['Nom', 'Email', 'Téléphone']],
      body: responsiblesData,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [139, 92, 246] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Aucun responsable assigné', 25, yPos);
    yPos += 15;
  }

  // Section Bénévoles
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Bénévoles Inscrits (${volunteers.length} / ${mission.maxVolunteers})`,
    20,
    yPos
  );
  yPos += 10;

  if (volunteers.length > 0) {
    const volunteersData = volunteers.map((volunteer) => [
      `${volunteer.firstName} ${volunteer.lastName}`,
      volunteer.email,
      volunteer.phone || 'N/A',
    ]);

    autoTable(doc, {
      head: [['Nom', 'Email', 'Téléphone']],
      body: volunteersData,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Aucun bénévole inscrit', 25, yPos);
  }

  // Pied de page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
      20,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }

  // Télécharger le PDF
  const fileName = `rapport-mission-${mission.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
}

/**
 * Génère un PDF avec les statistiques globales
 */
export async function exportGlobalStatsPDF(
  missions: MissionClient[],
  totalVolunteers: number
) {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.text('Festival Films Courts de Dinan 2025', 105, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.text('Rapport de Statistiques', 105, 30, { align: 'center' });

  let yPos = 50;

  // Statistiques Générales
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistiques Générales', 20, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const totalMissions = missions.length;
  const publishedMissions = missions.filter((m) => m.status === 'published').length;
  const completedMissions = missions.filter((m) => m.status === 'completed').length;
  const totalSlots = missions.reduce((sum, m) => sum + m.maxVolunteers, 0);
  const filledSlots = missions.reduce((sum, m) => sum + m.volunteers.length, 0);
  const fillRate = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

  doc.text(`Total des missions: ${totalMissions}`, 25, yPos);
  yPos += 7;
  doc.text(`Missions publiées: ${publishedMissions}`, 25, yPos);
  yPos += 7;
  doc.text(`Missions terminées: ${completedMissions}`, 25, yPos);
  yPos += 7;
  doc.text(`Total bénévoles actifs: ${totalVolunteers}`, 25, yPos);
  yPos += 7;
  doc.text(`Places disponibles: ${totalSlots}`, 25, yPos);
  yPos += 7;
  doc.text(`Places occupées: ${filledSlots}`, 25, yPos);
  yPos += 7;
  doc.text(`Taux de remplissage: ${fillRate}%`, 25, yPos);
  yPos += 15;

  // Tableau des missions
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Détail des Missions', 20, yPos);
  yPos += 10;

  const missionsData = missions.map((mission) => [
    mission.title,
    getStatusLabel(mission.status),
    `${mission.volunteers.length}/${mission.maxVolunteers}`,
    mission.startDate
      ? format(new Date(mission.startDate), 'dd/MM/yyyy', { locale: fr })
      : 'N/A',
  ]);

  autoTable(doc, {
    head: [['Mission', 'Statut', 'Bénévoles', 'Date']],
    body: missionsData,
    startY: yPos,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Pied de page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
      20,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }

  // Télécharger le PDF
  const fileName = `statistiques-festival-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
}

// Helpers
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    published: 'Publiée',
    full: 'Complète',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };
  return labels[status] || status;
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    volunteer: 'Bénévole',
    mission_responsible: 'Responsable',
    admin: 'Administrateur',
  };
  return labels[role] || role;
}

