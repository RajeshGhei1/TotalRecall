
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: 'ghost' | 'default';
  className?: string;
}

const NavItem = ({ href, icon: Icon, label, variant = 'ghost', className = '' }: NavItemProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Button
      variant={variant}
      className={`w-full justify-start ${isActive(href) ? 'bg-primary text-primary-foreground' : ''} ${className}`}
      asChild
    >
      <Link to={href}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
};

export default NavItem;
