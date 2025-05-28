
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2,
  Building2, 
  CircleDollarSign, 
  CreditCard, 
  Headset, 
  LayoutDashboard, 
  Settings, 
  Store, 
  Users,
  Users2,
  PieChart,
  Package
} from 'lucide-react';

const SuperAdminNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/superadmin/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const navItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      href: '/superadmin/dashboard',
      isActive: isActive('/superadmin/dashboard') 
    },
    { 
      label: 'Tenants', 
      icon: <Store size={20} />, 
      href: '/superadmin/tenants',
      isActive: isActive('/superadmin/tenants') 
    },
    { 
      label: 'Users', 
      icon: <Users size={20} />, 
      href: '/superadmin/users',
      isActive: isActive('/superadmin/users') 
    },
    { 
      label: 'Companies', 
      icon: <Building2 size={20} />, 
      href: '/superadmin/companies',
      isActive: isActive('/superadmin/companies') 
    },
    { 
      label: 'People', 
      icon: <Users2 size={20} />, 
      href: '/superadmin/people',
      isActive: isActive('/superadmin/people') 
    },
    { 
      label: 'Subscription Plans', 
      icon: <Package size={20} />, 
      href: '/superadmin/subscription-plans',
      isActive: isActive('/superadmin/subscription-plans') 
    },
    { 
      label: 'Revenue', 
      icon: <CircleDollarSign size={20} />, 
      href: '/superadmin/revenue',
      isActive: isActive('/superadmin/revenue') 
    },
    {
      label: 'Analytics', 
      icon: <PieChart size={20} />, 
      href: '/superadmin/analytics',
      isActive: isActive('/superadmin/analytics')
    },
    { 
      label: 'Settings', 
      icon: <Settings size={20} />, 
      href: '/superadmin/settings',
      isActive: isActive('/superadmin/settings') 
    },
  ];

  return (
    <nav className="space-y-2 px-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            item.isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default SuperAdminNav;
