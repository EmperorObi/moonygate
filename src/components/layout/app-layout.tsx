
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter, 
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { siteConfig, type NavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import { Package2, LogOut } from "lucide-react"; 
import { usePageLoading } from '@/contexts/loading-context';


// TODO: Import Firebase auth methods from your firebaseClient.ts
// import { auth } from '@/lib/firebase/firebaseClient';
// import { signOut } from 'firebase/auth';


function MainSidebar() {
  const pathname = usePathname();
  const { open, isMobile, setOpenMobile } = useSidebar(); 
  const router = useRouter(); 
  const { startRouteTransition } = usePageLoading();

  const handleLogout = async () => {
    // --- TODO: Firebase Client-Side Logout ---
    // try {
    //   await signOut(auth);
    //   // Clear any local session/token if you're managing it manually outside Firebase's persistence
    //   console.log('Logout successful');
    //   router.push('/login'); 
    // } catch (error) {
    //   console.error('Logout error:', error);
    //   // Handle logout error (e.g., show a toast notification)
    // }
    // --- End of TODO ---

    // Placeholder logic (remove when Firebase auth is implemented)
    alert('Logout successful (placeholder)! Implement Firebase client logout.');
    router.push('/login');

    if (isMobile && setOpenMobile) {
      setOpenMobile(false); 
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link 
          href="/" 
          className="flex items-center gap-2"
          onClick={() => {
            if (pathname !== "/") {
              startRouteTransition();
            }
            if (isMobile && setOpenMobile) {
              setOpenMobile(false);
            }
          }}
        >
          <Package2 className="h-8 w-8 text-sidebar-primary" />
          <span
            className={cn(
              "font-semibold text-lg text-sidebar-foreground",
              !open && "hidden" 
            )}
          >
            {siteConfig.name}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent asChild className="flex flex-col justify-between">
        <ScrollArea className="h-full">
          <SidebarMenu className="p-2">
            {siteConfig.navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                >
                  <Link 
                    href={item.href} 
                    onClick={() => {
                      if (pathname !== item.href) {
                        startRouteTransition();
                      }
                      if (isMobile && setOpenMobile) {
                        setOpenMobile(false);
                      }
                    }}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                startRouteTransition(); 
                handleLogout();
              }}
              tooltip="Logout"
              variant="default" 
              className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function PageHeader() {
  const pathname = usePathname();
  const currentNavItem = siteConfig.navItems.find(item => item.href === pathname);
  const pageTitle = pathname === '/login' ? 'Sign In' : (currentNavItem ? currentNavItem.title : siteConfig.name);


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <SidebarTrigger className="sm:hidden" />
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const { endRouteTransition } = usePageLoading();
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('sidebar_state='))
        ?.split('=')[1];
      if (cookieValue) {
        setDefaultOpen(cookieValue === 'true');
      }
    }
  }, []);

  React.useEffect(() => {
    // This effect runs after the navigation has occurred and pathname has updated
    endRouteTransition();
  }, [pathname, endRouteTransition]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <MainSidebar />
      <SidebarInset className="flex flex-col">
        <PageHeader />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
