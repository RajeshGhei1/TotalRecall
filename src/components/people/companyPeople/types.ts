
import { Person } from '@/types/person';

export interface PersonWithRole extends Person {
  role?: string;
}

export interface CompanyPeopleManagerProps {
  companyId: string;
}

export interface PersonListItemProps {
  person: PersonWithRole;
  onRemove: (personId: string) => void;
  onUpdateRole: (personId: string, role: string) => void;
  onLink?: (person: PersonWithRole) => void;
  isLinked?: boolean;
}

export interface SearchPersonsProps {
  personType: 'talent' | 'contact';
  onPersonSelected: (person: Person) => void;
  onCreatePerson: () => void;
}

export interface SelectedPeopleListProps {
  people: PersonWithRole[];
  onRemove: (personId: string) => void;
  onUpdateRole: (personId: string, role: string) => void;
  onLink: (person: PersonWithRole) => void;
  linkedPersonIds: string[];
}
