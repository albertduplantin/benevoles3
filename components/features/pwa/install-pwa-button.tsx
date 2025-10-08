'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon, XIcon } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Vérifier si l'utilisateur a déjà fermé le banner (localStorage)
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (bannerDismissed === 'true') {
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Ne PAS afficher le banner automatiquement
      // setShowBanner(true) est supprimé
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Écouter l'installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowBanner(false);
      console.log('✅ PWA installée avec succès !');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Afficher la prompt d'installation
    deferredPrompt.prompt();

    // Attendre le choix de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ Utilisateur a accepté l\'installation');
    } else {
      console.log('❌ Utilisateur a refusé l\'installation');
      // Mémoriser que l'utilisateur a refusé
      localStorage.setItem('pwa-banner-dismissed', 'true');
    }

    // Réinitialiser
    setDeferredPrompt(null);
    setIsInstallable(false);
    setShowBanner(false);
  };
  
  const handleDismissBanner = () => {
    setShowBanner(false);
    // Mémoriser que l'utilisateur a fermé le banner
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  // Ne rien afficher si déjà installé ou non installable
  if (isInstalled || !isInstallable) {
    return null;
  }

  // Bouton d'installation (visible sur desktop et mobile)
  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="w-full"
      title="Installer l'application"
    >
      <DownloadIcon className="mr-2 h-4 w-4" />
      Installer l'application
    </Button>
  );
}

