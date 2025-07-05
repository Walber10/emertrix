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
import { Users, BarChart3, BookOpen, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';

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
  const { appData } = useApp();
  const { onboarding } = useOnboardingState();

  const isActive = (url: string) => location.pathname === url;

  // Get user data from onboarding state
  const accountData = onboarding.account;
  const userInitials = accountData ? `${accountData.name?.charAt(0) || ''}`.toUpperCase() : 'U';
  const userName = accountData?.name || 'User';
  const userRole = 'Safety Manager';

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
          <div className="w-8 h-8 bg-emertrix-gradient rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">{userInitials}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
