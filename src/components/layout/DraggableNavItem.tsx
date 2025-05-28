
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Move, Edit3 } from 'lucide-react';
import RenameNavItemDialog from './RenameNavItemDialog';

interface DraggableNavItemProps {
  id: string;
  href: string;
  icon: React.ComponentType<{ size?: string | number }>;
  label: string;
  customLabel?: string;
  onRename: (newLabel: string) => void;
  onResetLabel: () => void;
}

const DraggableNavItem: React.FC<DraggableNavItemProps> = ({ 
  id, 
  href, 
  icon: Icon, 
  label,
  customLabel,
  onRename,
  onResetLabel
}) => {
  const location = useLocation();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  
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

  const displayLabel = customLabel || label;

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRenameDialogOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center gap-3 rounded-lg transition-all ${
          isDragging ? 'opacity-50 z-50' : ''
        }`}
        onContextMenu={handleRightClick}
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
          <span className="flex-1">{displayLabel}</span>
          {customLabel && (
            <span className="text-xs opacity-50">•</span>
          )}
        </Link>

        <button
          onClick={() => setIsRenameDialogOpen(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
          title="Rename navigation item"
        >
          <Edit3 size={12} className="text-muted-foreground" />
        </button>
      </div>

      <RenameNavItemDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        itemLabel={label}
        customLabel={customLabel}
        onRename={onRename}
        onReset={onResetLabel}
      />
    </>
  );
};

export default DraggableNavItem;
