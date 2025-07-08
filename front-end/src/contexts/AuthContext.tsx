import React, { ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { useAuthLogic } from '@/hooks/useAuthLogic';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authLogic = useAuthLogic();

  return <AuthContext.Provider value={authLogic}>{children}</AuthContext.Provider>;
};
