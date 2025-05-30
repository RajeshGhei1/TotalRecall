
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  badge?: string | null;
  moduleName?: string;
}

export interface NavItem {
  id: string;
  label: string;
  customLabel?: string;
  icon: React.ComponentType<{ size?: string | number }>;
  href: string;
}
