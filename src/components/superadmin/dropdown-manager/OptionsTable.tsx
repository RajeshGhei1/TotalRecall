
import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { DropdownOption } from '@/hooks/dropdown/types';
import SortableOptionItem from './SortableOptionItem';

interface OptionsTableProps {
  options: DropdownOption[];
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  handleSaveOrder: () => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDeleteOption: (id: string) => void;
  isSaving: boolean;
}

const OptionsTable = ({
  options,
  isLoading,
  hasUnsavedChanges,
  handleSaveOrder,
  handleDragEnd,
  handleDeleteOption,
  isSaving
}: OptionsTableProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="border rounded-md overflow-hidden">
      {hasUnsavedChanges && (
        <div className="bg-amber-50 p-3 flex items-center justify-between border-b">
          <p className="text-sm text-amber-700">
            You've changed the order of items. Remember to save your changes.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveOrder}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Order
              </>
            )}
          </Button>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Label
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </td>
            </tr>
          ) : options.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                No options found for this category. Add some options above.
              </td>
            </tr>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={options.map(option => option.id)}
                strategy={verticalListSortingStrategy}
              >
                {options.map((option) => (
                  <SortableOptionItem 
                    key={option.id} 
                    option={option} 
                    onDelete={handleDeleteOption} 
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OptionsTable;
