
import React from 'react';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MultiSelectFilterProps {
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxCount?: number;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
  maxCount = 3,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      <MultiSelect
        options={options}
        onValueChange={onChange}
        value={value}
        placeholder={placeholder || `Select ${label.toLowerCase()}`}
        maxCount={maxCount}
      />
    </div>
  );
};

export default MultiSelectFilter;
