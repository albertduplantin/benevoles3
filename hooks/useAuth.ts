import { useContext } from 'react';
import { AuthContext } from '@/components/providers/auth-provider';

/**
 * Custom hook to use auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

