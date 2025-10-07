/**
 * Catégories de missions pour le Festival Films Courts de Dinan
 */

export const MISSION_CATEGORIES = {
  // Accueil public et professionnels
  ACCUEIL_ACCREDITATIONS: 'Accréditations (outil)',
  ACCUEIL_VIP: 'Accueil VIP',
  
  // Gestion & logistique
  GESTION_BILLETTERIE: 'Billetterie / vente',
  GESTION_CONTROLE: "Contrôle d'accès",
  GESTION_TRANSPORTS: 'Transports & accompagnement',
  GESTION_LOGISTIQUE: 'Logistique & technique',
  
  // Communication
  COMM_RESEAUX: 'Communication & réseaux sociaux',
  COMM_PUBLICS: 'Développement des publics',
  COMM_PRO: 'Volet professionnel',
  COMM_AFFICHAGE: 'Affichage / flyers',
  
  // Bar & restauration
  BAR_GENERAL: 'Bar / Restauration générale',
  BAR_SAMEDI: 'Samedi soir : coordination restauration',
} as const;

export type MissionCategory = typeof MISSION_CATEGORIES[keyof typeof MISSION_CATEGORIES];

/**
 * Catégories groupées par section pour affichage dans le formulaire
 */
export const GROUPED_CATEGORIES = [
  {
    group: 'Accueil public et professionnels',
    categories: [
      { value: MISSION_CATEGORIES.ACCUEIL_ACCREDITATIONS, label: 'Accréditations (outil)' },
      { value: MISSION_CATEGORIES.ACCUEIL_VIP, label: 'Accueil VIP' },
    ],
  },
  {
    group: 'Gestion & logistique',
    categories: [
      { value: MISSION_CATEGORIES.GESTION_BILLETTERIE, label: 'Billetterie / vente' },
      { value: MISSION_CATEGORIES.GESTION_CONTROLE, label: "Contrôle d'accès" },
      { value: MISSION_CATEGORIES.GESTION_TRANSPORTS, label: 'Transports & accompagnement' },
      { value: MISSION_CATEGORIES.GESTION_LOGISTIQUE, label: 'Logistique & technique' },
    ],
  },
  {
    group: 'Communication',
    categories: [
      { value: MISSION_CATEGORIES.COMM_RESEAUX, label: 'Communication & réseaux sociaux' },
      { value: MISSION_CATEGORIES.COMM_PUBLICS, label: 'Développement des publics' },
      { value: MISSION_CATEGORIES.COMM_PRO, label: 'Volet professionnel' },
      { value: MISSION_CATEGORIES.COMM_AFFICHAGE, label: 'Affichage / flyers' },
    ],
  },
  {
    group: 'Bar & restauration',
    categories: [
      { value: MISSION_CATEGORIES.BAR_GENERAL, label: 'Bar / Restauration générale' },
      { value: MISSION_CATEGORIES.BAR_SAMEDI, label: 'Samedi soir : coordination restauration' },
    ],
  },
] as const;

/**
 * Liste plate de toutes les catégories pour validation (strings uniquement)
 */
export const ALL_CATEGORIES = Object.values(MISSION_CATEGORIES);

/**
 * Liste de toutes les catégories avec value et label pour les formulaires
 */
export const ALL_CATEGORIES_WITH_LABELS: Array<{ value: string; label: string }> = GROUPED_CATEGORIES.flatMap(group => group.categories.map(cat => ({ value: cat.value, label: cat.label })));

