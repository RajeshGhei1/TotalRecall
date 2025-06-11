
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft,
  Home,
  Users,
  Building2,
  FileText,
  CreditCard,
  Settings,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/superadmin',
    icon: Home,
  },
  {
    title: 'Users',
    href: '/superadmin/users',
    icon: Users,
  },
  {
    title: 'Companies',
    href: '/superadmin/companies',
    icon: Building2,
  },
  {
    title: 'Forms',
    href: '/superadmin/forms',
    icon: FileText,
  },
  {
    title: 'Subscriptions',
    href: '/superadmin/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/superadmin/settings',
    icon: Settings,
  },
];

export function DocumentationSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Documentation</span>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="p-4 border-b border-gray-100">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => navigate('/superadmin')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Total Recall Documentation
        </div>
      </div>
    </div>
  );
}
