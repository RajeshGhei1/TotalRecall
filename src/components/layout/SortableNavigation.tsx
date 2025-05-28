
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { handleDragEnd } from '@/utils/dragAndDrop';
import DraggableNavItem from './DraggableNavItem';

interface NavItem {
  id: string;
  label: string;
  customLabel?: string;
  icon: React.ComponentType<{ size?: string | number }>;
  href: string;
}

interface SortableNavigationProps {
  items: NavItem[];
  onReorder: (newItems: NavItem[]) => void;
  onRename: (id: string, newLabel: string) => void;
  onResetLabel: (id: string) => void;
}

const SortableNavigation: React.FC<SortableNavigationProps> = ({ 
  items, 
  onReorder,
  onRename,
  onResetLabel
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndEvent = (event: DragEndEvent) => {
    handleDragEnd(items, event, onReorder);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEndEvent}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <nav className="space-y-2 px-2">
          {items.map((item) => (
            <DraggableNavItem
              key={item.id}
              id={item.id}
              href={item.href}
              icon={item.icon}
              label={item.label}
              customLabel={item.customLabel}
              onRename={(newLabel) => onRename(item.id, newLabel)}
              onResetLabel={() => onResetLabel(item.id)}
            />
          ))}
        </nav>
      </SortableContext>
    </DndContext>
  );
};

export default SortableNavigation;
