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
import { GROUPED_CATEGORIES } from '@/lib/constants/mission-categories';

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
      status: 'draft',
    },
  });

  // Charger les catégories autorisées pour le responsable
  useEffect(() => {
    const loadAllowedCategories = async () => {
      if (!user) {
        setIsLoadingCategories(false);
        return;
      }

      // Admin peut créer dans toutes les catégories
      if (user.role === 'admin') {
        setAllowedCategories(GROUPED_CATEGORIES.flatMap(g => g.categories.map(c => c.value)));
        setIsLoadingCategories(false);
        return;
      }

      // Responsable de catégorie : charger ses catégories
      if (user.role === 'category_responsible') {
        try {
          const response = await fetch(`/api/my-categories?userId=${user.uid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          const data = await response.json();
          const categoryIds = data.categories?.map((c: any) => c.categoryId) || [];
          setAllowedCategories(categoryIds);

          // Si une seule catégorie, la présélectionner
          if (categoryIds.length === 1 && mode === 'create') {
            setValue('category', categoryIds[0]);
          }
        } catch (error) {
          console.error('Error loading categories:', error);
          setError('Erreur lors du chargement des catégories');
        }
      }

      setIsLoadingCategories(false);
    };

    loadAllowedCategories();
  }, [user, mode, setValue]);

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

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'edit' && missionId) {
        // Mode édition
        await updateMission(missionId, data);
        router.push(`/dashboard/missions/${missionId}`);
      } else {
        // Mode création
        await createMission(data, user.uid);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard/missions');
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
                  {GROUPED_CATEGORIES.map((group) => {
                    // Filtrer les catégories du groupe selon les catégories autorisées
                    const filteredCategories = group.categories.filter(cat => 
                      allowedCategories.includes(cat.value)
                    );
                    
                    // N'afficher le groupe que s'il contient des catégories autorisées
                    if (filteredCategories.length === 0) return null;
                    
                    return (
                      <optgroup key={group.group} label={group.group}>
                        {filteredCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
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
                    setValueAs: (v) => (v ? new Date(v) : undefined),
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
                    setValueAs: (v) => (v ? new Date(v) : undefined),
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
                onCheckedChange={(checked) => setValue('isRecurrent', checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="isRecurrent" className="cursor-pointer">
                Mission récurrente
              </Label>
            </div>
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

