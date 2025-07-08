import { useMeQuery } from '@/api/queries';
import { useLoginMutation, useLogoutMutation } from '@/api/mutations';
import { AuthContextType } from '@/contexts/auth-context';

export function useAuthLogic(): AuthContextType {
  const { data: user, isLoading, isError, error } = useMeQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    loading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    error: (error as Error)?.message || loginMutation.error?.message || null,
  };
}
