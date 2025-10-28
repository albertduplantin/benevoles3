'use client';

import { useEffect } from 'react';

/**
 * Component to manually register our custom service worker
 * This avoids the transpilation issues with @ducanh2912/next-pwa
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register our custom service worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is installed, notify user
                  console.log('🔄 New version available! Refresh to update.');
                  // Optionally show a toast notification here
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('⚠️ Service Worker registration failed:', error);
        });

      // Register Firebase Messaging Service Worker
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('✅ Firebase Messaging Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.warn('⚠️ Firebase Messaging Service Worker registration failed:', error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}

