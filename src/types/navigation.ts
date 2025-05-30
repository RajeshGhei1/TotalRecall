
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  badge?: string | null;
  moduleName?: string;
}
