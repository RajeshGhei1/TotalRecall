
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * A reusable function for handling drag end events in sortable lists.
 * 
 * @param items The current array of items being sorted
 * @param event The drag end event from DndKit
 * @param onReorder Optional callback that will be called with the new array if items were reordered
 * @returns The new array of items after reordering, or the original array if no reordering occurred
 */
export function handleDragEnd<T extends { id: string }>(
  items: T[],
  event: DragEndEvent,
  onReorder?: (newItems: T[]) => void
): T[] {
  const { active, over } = event;
  
  console.log('handleDragEnd called:', { activeId: active.id, overId: over?.id });
  
  if (over && active.id !== over.id) {
    // Find the indices of the items
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    
    console.log('Moving item:', { oldIndex, newIndex, activeId: active.id, overId: over.id });
    
    if (oldIndex === -1 || newIndex === -1) {
      console.warn('Could not find item indices:', { oldIndex, newIndex });
      return items;
    }
    
    // Reorder the array
    const newItems = arrayMove(items, oldIndex, newIndex);
    
    console.log('Items reordered:', { 
      before: items.map(i => i.id), 
      after: newItems.map(i => i.id) 
    });
    
    // Call the callback if provided
    if (onReorder) {
      try {
        onReorder(newItems);
      } catch (error) {
        console.error('Error in onReorder callback:', error);
      }
    }
    
    // Return the new array
    return newItems;
  }
  
  console.log('No reordering needed');
  // Return the original array if no reordering occurred
  return items;
}

/**
 * A helper function to assign sort order values to an array of items
 * 
 * @param items The array of items to assign sort orders to
 * @returns A new array with sort_order properties added
 */
export function assignSortOrder<T>(items: T[]): (T & { sort_order: number })[] {
  return items.map((item, index) => ({
    ...item,
    sort_order: index
  }));
}
