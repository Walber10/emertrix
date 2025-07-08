import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { EmertrixLogo } from '@/components/EmertrixLogo';
import { Users, BarChart3, BookOpen, Target, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';

const dashboardItems = [
  {
    title: 'Dashboard',
    url: '/organization-dashboard',
    icon: BarChart3,
  },
];

const peopleItems = [
  {
    title: 'People',
    url: '/people',
    icon: Users,
  },
];

const preparednessItems = [
  {
    title: 'Training',
    url: '/training',
    icon: BookOpen,
  },
  {
    title: 'Exercises',
    url: '/exercises',
    icon: Target,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const isActive = (url: string) => location.pathname === url;

  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName = user?.name || 'User';
  const userRole = user?.role === 'admin' ? 'Safety Manager' : user?.role || '';
  const profilePicture = user?.profilePicture;

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <EmertrixLogo size="md" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} size="lg">
                    <Link to={item.url}>
                      <item.icon />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {peopleItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} size="lg">
                    <Link to={item.url}>
                      <item.icon />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-base">Preparedness</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSub>
                  {preparednessItems.map(item => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center space-x-3">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-emertrix-gradient rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">{userInitials}</span>
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
        <button
          onClick={auth?.logout}
          className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
