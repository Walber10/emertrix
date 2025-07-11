import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

export function MasterOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  console.log('here', user);
  if (loading)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  if (!user || user.role !== UserRole.MASTER) return <Navigate to="/" />;
  return <>{children}</>;
}

export function NonMasterOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (user.role === UserRole.MASTER) return <Navigate to="/master-admin" />;
  return <>{children}</>;
}
