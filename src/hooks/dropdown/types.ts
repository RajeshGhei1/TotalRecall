
export interface DropdownCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface DropdownOption {
  id: string;
  category_id: string;
  value: string;
  label: string;
  is_default: boolean | null;
  sort_order: number | null;
}
