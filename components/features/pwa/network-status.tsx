'use client';

import { useEffect, useState } from 'react';
import { WifiOffIcon, WifiIcon } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Initialiser l'état
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 animate-slide-down ${
        isOnline
          ? 'bg-green-600'
          : 'bg-red-600'
      } text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      {isOnline ? (
        <>
          <WifiIcon className="h-5 w-5" />
          <span className="font-medium">Connexion rétablie</span>
        </>
      ) : (
        <>
          <WifiOffIcon className="h-5 w-5" />
          <span className="font-medium">Hors ligne</span>
        </>
      )}
    </div>
  );
}

