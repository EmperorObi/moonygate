import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, FileText, Users, Settings, Bell, BarChart3, Network, ShieldCheck } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const siteConfig = {
  name: "Mooney gateway",
  description: "API Gateway & Orchestration Layer for Credit Fixer AI Agent",
  navItems: [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "File Processing",
      href: "/file-processing",
      icon: FileText,
    },
    {
      title: "AI Orchestration",
      href: "/ai-orchestration",
      icon: BarChart3,
    },
    {
      title: "User Management",
      href: "/user-management",
      icon: Users,
    },
    {
      title: "API Settings",
      href: "/api-settings",
      icon: Settings,
    },
    {
      title: "Security",
      href: "/security",
      icon: ShieldCheck,
    },
    {
      title: "Request Routing",
      href: "/request-routing",
      icon: Network,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
  ] satisfies NavItem[],
};
