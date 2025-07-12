
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormPlacement } from '@/types/form-builder';
import { useFormContext } from '@/contexts/FormContext';
import { FileText } from 'lucide-react';

interface FormNavigationItemProps {
  placement: FormPlacement & {
    form_definitions: unknown;
  };
  isCollapsed?: boolean;
}

const FormNavigationItem: React.FC<FormNavigationItemProps> = ({ 
  placement, 
  isCollapsed = false 
}) => {
  const { openForm } = useFormContext();
  const form = placement.form_definitions as { id: string; name: string; description?: string };

  const handleClick = () => {
    openForm(form, placement.id);
  };

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="w-full justify-center p-2"
        title={form.name}
      >
        <FileText className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="w-full justify-start px-3 py-2 h-auto"
    >
      <div className="flex items-center gap-3 w-full">
        <FileText className="h-4 w-4 flex-shrink-0" />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium">{form.name}</div>
          {form.description && (
            <div className="text-xs text-muted-foreground truncate">
              {form.description}
            </div>
          )}
        </div>
        {placement.priority > 0 && (
          <Badge variant="secondary" className="text-xs">
            Priority
          </Badge>
        )}
      </div>
    </Button>
  );
};

export default FormNavigationItem;
