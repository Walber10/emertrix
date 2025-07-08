import { Sidebar, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { EmertrixLogo } from '@/components/EmertrixLogo';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User } from 'lucide-react';
import { ReactNode } from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface MasterAdminLayoutProps {
  children: ReactNode;
}

export function MasterAdminLayout({ children }: MasterAdminLayoutProps) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await auth?.logout();
      queryClient.clear();
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of the system.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'There was an error logging out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleProfileSettings = () => {
    toast({
      title: 'Profile Settings',
      description: 'Profile settings functionality coming soon.',
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64 bg-white border-r flex flex-col justify-between">
          <SidebarHeader className="border-b px-6 py-4">
            <EmertrixLogo size="md" />
          </SidebarHeader>
          <SidebarFooter className="border-t p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emertrix-gradient rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Master Admin</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleProfileSettings}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                  disabled={auth?.loading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {auth?.loading ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 min-h-screen bg-gray-50">
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
