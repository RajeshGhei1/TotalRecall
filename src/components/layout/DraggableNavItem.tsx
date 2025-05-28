
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Move } from 'lucide-react';

interface DraggableNavItemProps {
  id: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const DraggableNavItem: React.FC<DraggableNavItemProps> = ({ 
  id, 
  href, 
  icon: Icon, 
  label 
}) => {
  const location = useLocation();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-lg transition-all ${
        isDragging ? 'opacity-50 z-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <Move size={12} className="text-muted-foreground" />
      </div>
      
      <Link
        to={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all flex-1 ${
          isActive(href) 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    </div>
  );
};

export default DraggableNavItem;
