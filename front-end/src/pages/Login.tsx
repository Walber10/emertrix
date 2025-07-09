import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmertrixLogo } from '@/components/EmertrixLogo';

function Login() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (auth?.isAuthenticated && auth.user) {
      if (auth.user.role === 'master') {
        navigate('/master-admin');
      } else {
        navigate('/organization-dashboard');
      }
    }
  }, [auth?.isAuthenticated, auth?.user, navigate]);

  if (auth?.loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await auth?.login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message || 'Login failed');
      } else {
        setFormError('Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center bg-[#0E093D] text-white w-1/2 p-12">
          <EmertrixLogo size="lg"  />
          <h2 className="text-3xl font-bold mt-8 mb-4">Welcome to Emertrix</h2>
          <p className="text-lg mb-2">Set up your organization to get started.</p>
          <p className="text-sm text-gray-200">Emergency planning made easy and effective.</p>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#0E093D] mb-2">Welcome to Emertrix</h2>
          <p className="text-gray-500 mb-6">
            Set up an organization to get started or log in to your account.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500]"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500]"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={auth?.loading}>
              Sign In
            </Button>
            {(formError || auth?.error) && (
              <div className="mt-4 text-red-600 text-sm">{formError || auth?.error}</div>
            )}
          </form>
          <div className="mt-4 text-center">
            <a href="/forgot-password" className="text-sm text-[#FF6500] hover:underline">
              Forgot your password?
            </a>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => navigate('/account-setup')}
          >
            Create Organization
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
