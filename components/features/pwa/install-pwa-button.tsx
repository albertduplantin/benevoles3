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

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Afficher le banner après 5 secondes
      setTimeout(() => setShowBanner(true), 5000);
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
    }

    // Réinitialiser
    setDeferredPrompt(null);
    setIsInstallable(false);
    setShowBanner(false);
  };

  // Ne rien afficher si déjà installé ou non installable
  if (isInstalled || !isInstallable) {
    return null;
  }

  // Banner flottant
  if (showBanner) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-2xl">
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎬</div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Installer l'application</h3>
              <p className="text-sm text-white/90 mb-3">
                Accédez rapidement à vos missions, même hors ligne !
              </p>
              <Button
                onClick={handleInstallClick}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Installer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bouton compact dans le header (optionnel)
  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="hidden md:flex"
    >
      <DownloadIcon className="mr-2 h-4 w-4" />
      Installer l'app
    </Button>
  );
}

