import React, { useState } from 'react';
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
  BookOpen,
  X,
  Menu,
  Clock,
  Star,
  TrendingUp,
  Code,
  Zap,
  Database,
  Shield,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { documentCategories } from '@/data/documentationCategories';
import { availableDocuments } from '@/data/documentationData';
import { atsDocuments } from '@/data/atsDocumentation';

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

// Get recent documents (last 5 viewed)
const getRecentDocuments = () => {
  const allDocs = [
    ...availableDocuments,
    ...atsDocuments.map(doc => ({
      ...doc,
      filePath: `ats-${doc.id}` // Add filePath for ATS documents
    }))
  ];
  return allDocs.slice(0, 5); // For now, just show first 5. In real app, this would be from localStorage/session
};

export function DocumentationSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const recentDocuments = getRecentDocuments();

  return (
    <>
      {/* Mobile overlay */}
      <div className={cn(
        "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden",
        isCollapsed ? "hidden" : "block"
      )} onClick={() => setIsCollapsed(true)} />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative z-50 bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300",
        isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64 lg:w-72 xl:w-80"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-2 transition-opacity",
            isCollapsed ? "opacity-0 lg:hidden" : "opacity-100"
          )}>
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Documentation</span>
          </div>
          
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>

        {/* Back Navigation */}
        <div className={cn(
          "p-4 border-b border-gray-100 transition-opacity",
          isCollapsed ? "opacity-0 lg:hidden" : "opacity-100"
        )}>
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

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Documentation Categories */}
            <div className={cn(
              "transition-opacity",
              isCollapsed ? "opacity-0 lg:hidden" : "opacity-100"
            )}>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {documentCategories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full text-left transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="truncate">{category.label}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Documents */}
            <div className={cn(
              "transition-opacity",
              isCollapsed ? "opacity-0 lg:hidden" : "opacity-100"
            )}>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Recent Documents
              </h3>
              <div className="space-y-1">
                {recentDocuments.map((doc) => (
                  <button
                    key={doc.filePath}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 w-full text-left group"
                    onClick={() => {
                      // This would trigger document loading in the main component
                      // For now, just navigate to documentation page
                      navigate('/superadmin/documentation');
                    }}
                  >
                    <FileText className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                    <span className="truncate text-gray-700 group-hover:text-gray-900">
                      {doc.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div className={cn(
              "transition-opacity",
              isCollapsed ? "opacity-0 lg:hidden" : "opacity-100"
            )}>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Quick Navigation
              </h3>
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-gray-100 transition-opacity",
          isCollapsed ? "opacity-0 lg:hidden" : "opacity-100"
        )}>
          <div className="text-xs text-gray-500">
            Total Recall Documentation
          </div>
        </div>
      </div>
    </>
  );
}
