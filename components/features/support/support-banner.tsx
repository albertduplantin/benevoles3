'use client';

import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';

export function SupportBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Vérifier si le bandeau a déjà été fermé (localStorage)
    const bannerClosed = localStorage.getItem('support-banner-closed');
    if (!bannerClosed) {
      // Afficher le bandeau après 2 secondes pour ne pas être trop intrusif
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mémoriser que l'utilisateur a fermé le bandeau (persiste pendant la session)
    localStorage.setItem('support-banner-closed', 'true');
  };

  // Ne pas afficher pendant le SSR
  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md mx-4">
        <div className="flex items-start gap-3 p-3">
          <div className="flex-shrink-0 mt-0.5">
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-700 leading-relaxed">
              <span className="font-medium">Bug ou question ?</span> Contactez Jérôme :{' '}
              <a 
                href="tel:0687563440" 
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                <Phone className="h-3 w-3" />
                06 87 56 34 40
              </a>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

