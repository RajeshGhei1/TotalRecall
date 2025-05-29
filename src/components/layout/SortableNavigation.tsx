
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndEvent = (event: DragEndEvent) => {
    console.log('Drag end event:', event);
    const result = handleDragEnd(items, event, onReorder);
    if (result !== items) {
      console.log('Items reordered:', result);
    }
  };

  // Extract only IDs for SortableContext
  const itemIds = items.map(item => item.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEndEvent}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <nav className="space-y-1 px-2 w-full">
          {items.map((item) => (
            <DraggableNavItem
              key={item.id}
              id={item.id}
              href={item.href}
              icon={item.icon}
              label={item.label}
              customLabel={item.customLabel}
              onRename={(newLabel) => {
                console.log('Renaming item:', item.id, 'to:', newLabel);
                onRename(item.id, newLabel);
              }}
              onResetLabel={() => {
                console.log('Resetting label for item:', item.id);
                onResetLabel(item.id);
              }}
            />
          ))}
        </nav>
      </SortableContext>
    </DndContext>
  );
};

export default SortableNavigation;
