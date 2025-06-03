
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  onMenuClick: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ onMenuClick }) => {
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="text-gray-500 hover:text-gray-900"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
};
