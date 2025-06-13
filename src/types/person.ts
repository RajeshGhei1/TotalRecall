
export interface Person {
  id: string;
  tr_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  type: 'talent' | 'contact';
  location?: string;
  created_at: string;
  updated_at: string;
  current_company?: {
    id: string;
    name: string;
    role: string;
  } | null;
  years_of_experience?: number;
}

export interface CreatePersonData {
  full_name: string;
  email: string;
  phone?: string;
  type: 'talent' | 'contact';
  location?: string;
}
