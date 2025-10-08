'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DownloadIcon, XIcon, ShareIcon } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPWAButtonProps {
  variant?: 'default' | 'outline' | 'black';
  className?: string;
}

export function InstallPWAButton({ variant = 'outline', className = '' }: InstallPWAButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Détecter iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Sur iOS, l'installation se fait via le menu partager
    // On affiche toujours le bouton sur iOS
    if (isIOSDevice) {
      return;
    }

    // Vérifier si l'utilisateur a déjà fermé le banner (localStorage)
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (bannerDismissed === 'true') {
      return;
    }

    // Écouter l'événement beforeinstallprompt (Chrome/Android uniquement)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
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
    // Sur iOS, afficher les instructions
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    // Sur Chrome/Android, utiliser l'API
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

  // Ne rien afficher si déjà installé
  if (isInstalled) {
    return null;
  }

  // Ne rien afficher sur Android/Chrome si non installable
  if (!isIOS && !isInstallable) {
    return null;
  }

  // Bouton d'installation (visible sur desktop et mobile)
  const buttonVariant = variant === 'black' ? 'default' : variant;
  const buttonClassName = variant === 'black' 
    ? `w-full bg-black hover:bg-gray-800 ${className}`
    : `w-full ${className}`;

  return (
    <>
      <Button
        onClick={handleInstallClick}
        variant={buttonVariant}
        size="sm"
        className={buttonClassName}
        title="Installer l'application"
      >
        {isIOS ? (
          <>
            <ShareIcon className="mr-2 h-4 w-4" />
            Installer l'application
          </>
        ) : (
          <>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Installer l'application
          </>
        )}
      </Button>

      {/* Dialog pour les instructions iOS */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Installer l'application sur iPhone</DialogTitle>
            <DialogDescription>
              Suivez ces étapes pour installer l'application sur votre écran d'accueil
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Tapez sur le bouton Partager</p>
                <p className="text-sm text-muted-foreground">
                  En bas de l'écran Safari <ShareIcon className="inline h-4 w-4" />
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Sélectionnez "Sur l'écran d'accueil"</p>
                <p className="text-sm text-muted-foreground">
                  Faites défiler et tapez sur cette option
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Tapez sur "Ajouter"</p>
                <p className="text-sm text-muted-foreground">
                  L'application sera installée sur votre écran d'accueil
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowIOSInstructions(false)}>
            Compris !
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

