import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
