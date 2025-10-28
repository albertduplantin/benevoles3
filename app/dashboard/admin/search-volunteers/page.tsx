'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isProfileComplete } from '@/lib/firebase/users';
import { getAllVolunteers } from '@/lib/firebase/volunteers';
import { getGroupedCategories } from '@/lib/firebase/mission-categories-db';
import { getAdminSettings } from '@/lib/firebase/admin-settings';
import { UserClient, MissionCategoryClient } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  SearchIcon, 
  Loader2, 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  CalendarIcon,
  FilterIcon,
  XIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getCategoryDescription } from '@/lib/constants/category-descriptions';

export default function SearchVolunteersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [volunteers, setVolunteers] = useState<UserClient[]>([]);
  const [categories, setCategories] = useState<MissionCategoryClient[]>([]);
  const [festivalDays, setFestivalDays] = useState<Array<{ date: string; label: string }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Filtres
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableForPreFestival, setAvailableForPreFestival] = useState<boolean | null>(null);
  const [hasVehicle, setHasVehicle] = useState<boolean | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Résultats
  const [filteredVolunteers, setFilteredVolunteers] = useState<UserClient[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !isProfileComplete(user)) {
      router.push('/auth/complete-profile');
    } else if (!loading && user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== 'admin') return;
      
      try {
        setIsLoadingData(true);
        
        const [volunteersData, groupedCategories, settings] = await Promise.all([
          getAllVolunteers(),
          getGroupedCategories(),
          getAdminSettings(),
        ]);
        
        setVolunteers(volunteersData);
        setCategories(groupedCategories.flatMap(g => g.categories));
        
        if (settings.festivalStartDate && settings.festivalEndDate) {
          const days = generateFestivalDays(settings.festivalStartDate, settings.festivalEndDate);
          setFestivalDays(days);
        }
        
        // Par défaut, afficher tous les bénévoles avec préférences
        const volunteersWithPrefs = volunteersData.filter(v => hasPreferences(v));
        setFilteredVolunteers(volunteersWithPrefs);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [user]);

  // Fonction pour générer les jours du festival
  function generateFestivalDays(startDate: Date, endDate: Date): Array<{ date: string; label: string }> {
    const days: Array<{ date: string; label: string }> = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const label = format(currentDate, 'EEEE d MMMM', { locale: fr });
      days.push({ 
        date: dateStr, 
        label: label.charAt(0).toUpperCase() + label.slice(1) 
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }

  // Vérifier si un bénévole a des préférences
  const hasPreferences = (volunteer: UserClient): boolean => {
    if (!volunteer.preferences) return false;
    const prefs = volunteer.preferences;
    
    return Boolean(
      (prefs.availableDateSlots && Object.keys(prefs.availableDateSlots).length > 0) ||
      (prefs.availableDates && prefs.availableDates.length > 0) ||
      (prefs.preferredCategories && prefs.preferredCategories.length > 0) ||
      (prefs.preferredTimeSlots && prefs.preferredTimeSlots.length > 0) ||
      prefs.availableForPreFestival === true ||
      prefs.hasCar === true ||
      (prefs.skills && prefs.skills.length > 0)
    );
  };

  // Appliquer les filtres
  const applyFilters = () => {
    let results = volunteers.filter(v => hasPreferences(v));
    
    // Filtre par date + créneau
    if (selectedDate && selectedDate !== 'all') {
      results = results.filter(v => {
        if (!v.preferences) return false;
        const prefs = v.preferences;
        
        // Nouveau format avec créneaux
        if (prefs.availableDateSlots && prefs.availableDateSlots[selectedDate]) {
          if (!selectedTimeSlot || selectedTimeSlot === 'all') return true;
          return prefs.availableDateSlots[selectedDate].includes(selectedTimeSlot as any);
        }
        
        // Ancien format
        if (prefs.availableDates) {
          return prefs.availableDates.includes(selectedDate);
        }
        
        return false;
      });
    }
    
    // Filtre par catégories
    if (selectedCategories.length > 0) {
      results = results.filter(v => {
        if (!v.preferences?.preferredCategories) return false;
        return selectedCategories.some(cat => v.preferences!.preferredCategories!.includes(cat));
      });
    }
    
    // Filtre missions en amont
    if (availableForPreFestival !== null) {
      results = results.filter(v => v.preferences?.availableForPreFestival === availableForPreFestival);
    }
    
    // Filtre véhicule
    if (hasVehicle !== null) {
      results = results.filter(v => v.preferences?.hasCar === hasVehicle);
    }
    
    // Filtre compétences
    if (selectedSkills.length > 0) {
      results = results.filter(v => {
        if (!v.preferences?.skills) return false;
        return selectedSkills.some(skill => v.preferences!.skills!.includes(skill));
      });
    }
    
    setFilteredVolunteers(results);
    toast.success(`${results.length} bénévole(s) trouvé(s)`);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedDate('all');
    setSelectedTimeSlot('all');
    setSelectedCategories([]);
    setAvailableForPreFestival(null);
    setHasVehicle(null);
    setSelectedSkills([]);
    
    const volunteersWithPrefs = volunteers.filter(v => hasPreferences(v));
    setFilteredVolunteers(volunteersWithPrefs);
    toast.info('Filtres réinitialisés');
  };

  if (loading || isLoadingData || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Liste des compétences communes
  const commonSkills = ['Permis de conduire', 'Premiers secours', 'Bilingue (Anglais)', 'Compétences techniques (son, lumière, vidéo)'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recherche de Bénévoles</h1>
        <p className="text-muted-foreground">
          Trouvez des bénévoles selon leurs préférences et disponibilités
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtres de recherche
          </CardTitle>
          <CardDescription>
            Sélectionnez les critères pour affiner votre recherche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date et créneau */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date du festival</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  {festivalDays.map((day) => (
                    <SelectItem key={day.date} value={day.date}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Créneau horaire</Label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot} disabled={selectedDate === 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les créneaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les créneaux</SelectItem>
                  <SelectItem value="morning">Matin (jusqu'à 13h)</SelectItem>
                  <SelectItem value="afternoon">Après-midi (13h-18h)</SelectItem>
                  <SelectItem value="evening">Soir (après 18h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Catégories */}
          <div className="space-y-2">
            <Label>Catégories préférées</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={selectedCategories.includes(cat.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, cat.value]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== cat.value));
                      }
                    }}
                  />
                  <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">
                    {cat.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Autres filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Missions en amont</Label>
              <Select 
                value={availableForPreFestival === null ? 'none' : availableForPreFestival.toString()} 
                onValueChange={(v) => setAvailableForPreFestival(v === 'none' ? null : v === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Peu importe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Peu importe</SelectItem>
                  <SelectItem value="true">Disponible</SelectItem>
                  <SelectItem value="false">Non disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Possède un véhicule</Label>
              <Select 
                value={hasVehicle === null ? 'none' : hasVehicle.toString()} 
                onValueChange={(v) => setHasVehicle(v === 'none' ? null : v === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Peu importe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Peu importe</SelectItem>
                  <SelectItem value="true">Oui</SelectItem>
                  <SelectItem value="false">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Compétences</Label>
              <Select 
                value="add-skill" 
                onValueChange={(v) => {
                  if (v && v !== 'add-skill' && !selectedSkills.includes(v)) {
                    setSelectedSkills([...selectedSkills, v]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter une compétence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add-skill" disabled>Ajouter une compétence</SelectItem>
                  {commonSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}>
                      {skill}
                      <XIcon className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-2">
            <Button onClick={applyFilters} className="flex-1">
              <SearchIcon className="h-4 w-4 mr-2" />
              Rechercher ({volunteers.filter(v => hasPreferences(v)).length} bénévoles)
            </Button>
            <Button onClick={resetFilters} variant="outline">
              <XIcon className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats ({filteredVolunteers.length})</CardTitle>
          <CardDescription>
            Bénévoles correspondant à vos critères de recherche
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVolunteers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun bénévole ne correspond à ces critères</p>
              <p className="text-sm mt-2">Essayez de modifier ou réinitialiser les filtres</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVolunteers.map((volunteer) => (
                <Card key={volunteer.uid} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold text-lg">
                            {volunteer.firstName} {volunteer.lastName}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MailIcon className="h-4 w-4" />
                            {volunteer.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="h-4 w-4" />
                            {volunteer.phone}
                          </div>
                        </div>

                        {/* Préférences */}
                        {volunteer.preferences && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {volunteer.preferences.availableDateSlots && Object.keys(volunteer.preferences.availableDateSlots).length > 0 && (
                              <Badge variant="secondary">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {Object.keys(volunteer.preferences.availableDateSlots).length} jour(s) + créneaux
                              </Badge>
                            )}
                            {volunteer.preferences.preferredCategories && volunteer.preferences.preferredCategories.length > 0 && (
                              <Badge variant="secondary">
                                🎯 {volunteer.preferences.preferredCategories.length} catégorie(s)
                              </Badge>
                            )}
                            {volunteer.preferences.availableForPreFestival && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                🔧 Dispo en amont
                              </Badge>
                            )}
                            {volunteer.preferences.hasCar && (
                              <Badge variant="secondary">
                                🚗 Véhicule
                              </Badge>
                            )}
                            {volunteer.preferences.skills && volunteer.preferences.skills.length > 0 && (
                              <Badge variant="secondary">
                                ⭐ {volunteer.preferences.skills.length} compétence(s)
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${volunteer.email}`}>
                          Contacter
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

