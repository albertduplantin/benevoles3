'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMission, updateMission } from '@/lib/firebase/missions';
import { missionSchema, MissionInput } from '@/lib/validations/mission';
import { MissionClient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { getGroupedCategories } from '@/lib/firebase/mission-categories-db';
import { MissionCategoryClient } from '@/types/category';
import { getAdminSettings } from '@/lib/firebase/admin-settings';

// Fonction pour générer tous les jours entre deux dates
function generateFestivalDays(startDate: Date, endDate: Date): Array<{ date: string; label: string }> {
  const days: Array<{ date: string; label: string }> = [];
  
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth();
  let currentDay = startDate.getDate();
  
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();
  const endDay = endDate.getDate();

  while (true) {
    const current = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
    const end = new Date(endYear, endMonth, endDay, 0, 0, 0, 0);
    
    if (current > end) break;
    
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const label = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(current);
    
    days.push({ 
      date: dateStr, 
      label: label.charAt(0).toUpperCase() + label.slice(1) 
    });
    
    currentDay++;
    const nextDate = new Date(currentYear, currentMonth, currentDay);
    currentYear = nextDate.getFullYear();
    currentMonth = nextDate.getMonth();
    currentDay = nextDate.getDate();
  }
  
  return days;
}

interface MissionFormProps {
  mode?: 'create' | 'edit';
  missionId?: string;
  initialData?: MissionClient;
  onSuccess?: () => void;
}

export function MissionForm({ 
  mode = 'create', 
  missionId,
  initialData,
  onSuccess 
}: MissionFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allowedCategories, setAllowedCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [groupedCategories, setGroupedCategories] = useState<Array<{ group: string; categories: MissionCategoryClient[] }>>([]);
  const [festivalDays, setFestivalDays] = useState<Array<{ date: string; label: string }>>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm<MissionInput>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      type: 'scheduled',
      maxVolunteers: 5,
      isUrgent: false,
      isRecurrent: false,
      status: 'published', // Par défaut: publiée
    },
  });

  // Charger les catégories depuis Firestore et les catégories autorisées pour le responsable
  useEffect(() => {
    const loadCategories = async () => {
      if (!user) {
        setIsLoadingCategories(false);
        return;
      }

      try {
        // Charger les catégories depuis Firestore
        const categories = await getGroupedCategories();
        setGroupedCategories(categories);

        // Admin peut créer dans toutes les catégories
        if (user.role === 'admin') {
          const allCategoryValues = categories.flatMap(g => g.categories.map(c => c.value));
          setAllowedCategories(allCategoryValues);
          setIsLoadingCategories(false);
          return;
        }

        // Responsable de catégorie : charger ses catégories
        if (user.role === 'category_responsible') {
          const response = await fetch(`/api/my-categories?userId=${user.uid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          const data = await response.json();
          const categoryIds = data.categories?.map((c: any) => c.categoryId) || [];
          
          // Convertir les categoryIds (IDs Firestore) en values (valeurs textuelles)
          // pour correspondre au format utilisé dans le dropdown
          const categoryValues: string[] = [];
          for (const group of categories) {
            for (const cat of group.categories) {
              if (categoryIds.includes(cat.id)) {
                categoryValues.push(cat.value);
              }
            }
          }
          
          setAllowedCategories(categoryValues);

          // Si une seule catégorie, la présélectionner
          if (categoryValues.length === 1 && mode === 'create') {
            setValue('category', categoryValues[0]);
          }
        }

        setIsLoadingCategories(false);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Erreur lors du chargement des catégories');
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [user, mode, setValue]);

  // Charger les dates du festival pour les missions récurrentes
  useEffect(() => {
    const loadFestivalDates = async () => {
      try {
        const settings = await getAdminSettings();
        if (settings.festivalStartDate && settings.festivalEndDate) {
          const days = generateFestivalDays(settings.festivalStartDate, settings.festivalEndDate);
          setFestivalDays(days);
        }
      } catch (error) {
        console.error('Error loading festival dates:', error);
      }
    };
    loadFestivalDates();
  }, []);

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // Convertir les dates en format datetime-local pour les inputs
      const formatDateForInput = (date: Date | undefined) => {
        if (!date) return undefined;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      reset({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        type: initialData.type,
        startDate: formatDateForInput(initialData.startDate) as any,
        endDate: formatDateForInput(initialData.endDate) as any,
        location: initialData.location,
        maxVolunteers: initialData.maxVolunteers,
        isUrgent: initialData.isUrgent,
        isRecurrent: initialData.isRecurrent,
        status: initialData.status,
      });
    }
  }, [mode, initialData, reset]);

  const missionType = watch('type');
  const isUrgent = watch('isUrgent');
  const isRecurrent = watch('isRecurrent');

  const onSubmit = async (data: MissionInput) => {
    if (!user) {
      setError(`Vous devez être connecté pour ${mode === 'edit' ? 'modifier' : 'créer'} une mission`);
      return;
    }

    // DEBUG: Log des données du formulaire

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'edit' && missionId) {
        // Mode édition - pas de récurrence
        await updateMission(missionId, data);
        router.push(`/dashboard/missions/${missionId}`);
      } else {
        // Mode création
        
        // Validation : si récurrent, il faut au moins un jour sélectionné
        if (data.isRecurrent && selectedDays.length === 0) {
          setError('Veuillez sélectionner au moins un jour du festival pour créer une mission récurrente.');
          setIsLoading(false);
          return;
        }
        
        if (data.isRecurrent && selectedDays.length > 0 && data.startDate && data.endDate) {
          // Mission récurrente : créer une mission par jour sélectionné
          const startHours = data.startDate.getHours();
          const startMinutes = data.startDate.getMinutes();
          const endHours = data.endDate.getHours();
          const endMinutes = data.endDate.getMinutes();

          let createdCount = 0;
          for (const dayDate of selectedDays) {
            const [year, month, day] = dayDate.split('-').map(Number);
            
            // Créer la date de début avec les bonnes heures
            const dayStartDate = new Date(year, month - 1, day, startHours, startMinutes);
            // Créer la date de fin avec les bonnes heures
            const dayEndDate = new Date(year, month - 1, day, endHours, endMinutes);

            await createMission({
              ...data,
              startDate: dayStartDate,
              endDate: dayEndDate,
            }, user.uid);
            
            createdCount++;
          }

          setError(null);
          alert(`✅ ${createdCount} mission(s) créée(s) avec succès !`);
          
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/dashboard/missions');
          }
        } else {
          // Mission simple
          await createMission(data, user.uid);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/dashboard/missions');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || `Une erreur est survenue lors de la ${mode === 'edit' ? 'modification' : 'création'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Modifier la Mission' : 'Créer une Mission'}</CardTitle>
        <CardDescription>
          {mode === 'edit' 
            ? 'Modifiez les informations de la mission'
            : 'Ajoutez une nouvelle mission pour le festival'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la mission *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: Accueil du public"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Décrivez la mission en détail..."
              disabled={isLoading}
              className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            {isLoadingCategories ? (
              <div className="w-full px-3 py-2 border border-input rounded-md bg-background text-muted-foreground">
                Chargement des catégories...
              </div>
            ) : allowedCategories.length === 0 ? (
              <div className="p-3 text-sm text-amber-600 bg-amber-50 rounded-md">
                Aucune catégorie assignée. Contactez un administrateur.
              </div>
            ) : (
              <>
                <select
                  id="category"
                  {...register('category')}
                  disabled={isLoading || allowedCategories.length === 1}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {groupedCategories.map((group) => {
                    // Filtrer les catégories du groupe selon les catégories autorisées
                    const filteredCategories = group.categories.filter(cat => 
                      allowedCategories.includes(cat.value)
                    );
                    
                    // N'afficher le groupe que s'il contient des catégories autorisées
                    if (filteredCategories.length === 0) return null;
                    
                    return (
                      <optgroup key={group.group} label={group.group}>
                        {filteredCategories.map((cat) => (
                          <option key={cat.id} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
                {allowedCategories.length === 1 && (
                  <p className="text-sm text-muted-foreground">
                    Vous ne pouvez créer des missions que dans cette catégorie.
                  </p>
                )}
              </>
            )}
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Type de mission */}
          <div className="space-y-2">
            <Label htmlFor="type">Type de mission *</Label>
            <select
              id="type"
              {...register('type')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="scheduled">Mission planifiée (avec horaires)</option>
              <option value="ongoing">Mission au long cours (sans horaire précis)</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Dates (uniquement si mission planifiée) */}
          {missionType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date et heure de début *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  {...register('startDate', {
                    setValueAs: (v) => {
                      if (!v) return undefined;
                      console.log('🔵 [PARSE START] Input value:', v);
                      // Parser la string datetime-local en tant que date locale
                      const [datePart, timePart] = v.split('T');
                      const [year, month, day] = datePart.split('-').map(Number);
                      const [hours, minutes] = timePart.split(':').map(Number);
                      const parsedDate = new Date(year, month - 1, day, hours, minutes);
                      console.log('🔵 [PARSE START] Parsed date:', parsedDate.toString());
                      console.log('🔵 [PARSE START] Parsed hours:', parsedDate.getHours());
                      return parsedDate;
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Date et heure de fin *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...register('endDate', {
                    setValueAs: (v) => {
                      if (!v) return undefined;
                      // Parser la string datetime-local en tant que date locale
                      const [datePart, timePart] = v.split('T');
                      const [year, month, day] = datePart.split('-').map(Number);
                      const [hours, minutes] = timePart.split(':').map(Number);
                      return new Date(year, month - 1, day, hours, minutes);
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Lieu */}
          <div className="space-y-2">
            <Label htmlFor="location">Lieu *</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Ex: Salle des fêtes, Entrée principale..."
              disabled={isLoading}
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Nombre de bénévoles */}
          <div className="space-y-2">
            <Label htmlFor="maxVolunteers">Nombre de bénévoles nécessaires *</Label>
            <Input
              id="maxVolunteers"
              type="number"
              min="1"
              max="100"
              {...register('maxVolunteers', { valueAsNumber: true })}
              disabled={isLoading}
            />
            {errors.maxVolunteers && (
              <p className="text-sm text-red-600">{errors.maxVolunteers.message}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isUrgent"
                checked={isUrgent}
                onCheckedChange={(checked) => setValue('isUrgent', checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="isUrgent" className="cursor-pointer">
                Mission urgente (affichée en priorité)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurrent"
                checked={isRecurrent}
                onCheckedChange={(checked) => {
                  setValue('isRecurrent', checked === true);
                  if (!checked) {
                    setSelectedDays([]); // Réinitialiser les jours sélectionnés
                  }
                }}
                disabled={isLoading || mode === 'edit'}
              />
              <Label htmlFor="isRecurrent" className="cursor-pointer">
                Mission récurrente {mode === 'edit' && '(non modifiable en édition)'}
              </Label>
            </div>

            {/* Sélection des jours du festival pour les missions récurrentes */}
            {isRecurrent && mode !== 'edit' && festivalDays.length > 0 && (
              <div className="space-y-2 pl-6 border-l-2 border-blue-500">
                <Label className="text-sm font-medium">
                  Sélectionnez les jours du festival pour cette mission récurrente :
                </Label>
                <p className="text-xs text-gray-500">
                  La mission sera créée pour chaque jour sélectionné avec les mêmes horaires.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {festivalDays.map((day) => (
                    <div key={day.date} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.date}`}
                        checked={selectedDays.includes(day.date)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDays([...selectedDays, day.date]);
                          } else {
                            setSelectedDays(selectedDays.filter(d => d !== day.date));
                          }
                        }}
                        disabled={isLoading}
                      />
                      <Label htmlFor={`day-${day.date}`} className="cursor-pointer text-sm">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {isRecurrent && selectedDays.length === 0 && (
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ Sélectionnez au moins un jour pour créer une mission récurrente.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut *</Label>
            <select
              id="status"
              {...register('status')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="draft">Brouillon (non visible)</option>
              <option value="published">Publiée (visible par les bénévoles)</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading 
                ? (mode === 'edit' ? 'Modification en cours...' : 'Création en cours...')
                : (mode === 'edit' ? 'Enregistrer les modifications' : 'Créer la mission')
              }
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

