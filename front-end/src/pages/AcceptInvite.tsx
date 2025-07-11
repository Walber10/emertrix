import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAcceptInviteMutation } from '@/api/mutations';
import { useQueryClient } from '@tanstack/react-query';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AcceptInvite = () => {
  const query = useQuery();
  const token = query.get('token') || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutation = useAcceptInviteMutation({
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      setTimeout(() => {
        navigate('/organization-dashboard');
      }, 1500);
    },
    onError: err => {
      setError((err as Error)?.message || 'Failed to accept invite.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    mutation.mutate({ token, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#0E093D] mb-4">Accept Your Admin Invite</h2>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        {success ? (
          <div className="text-green-600 text-center font-semibold">
            Invite accepted! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500]"
                placeholder="Enter a new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500]"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Accepting...' : 'Accept Invite'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;
