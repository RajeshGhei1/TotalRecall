
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Building } from 'lucide-react';
import { PersonWithRole } from './types';

interface PersonListItemProps {
  person: PersonWithRole;
  onRemove: (personId: string) => void;
  onUpdateRole: (personId: string, role: string) => void;
  onLink?: (person: PersonWithRole) => void;
  isLinked?: boolean;
}

const PersonListItem: React.FC<PersonListItemProps> = ({
  person,
  onRemove,
  onUpdateRole,
  onLink,
  isLinked = false
}) => {
  return (
    <div key={person.id} className="flex items-center justify-between border p-3 rounded-md">
      <div>
        <div className="font-medium">{person.full_name}</div>
        <div className="text-sm text-muted-foreground">{person.email}</div>
        <div className="text-xs text-muted-foreground">
          {person.type === 'talent' ? 'Talent' : 'Business Contact'}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Role in company" 
          className="w-48"
          value={person.role || ''}
          onChange={(e) => onUpdateRole(person.id, e.target.value)}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(person.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        {!isLinked && onLink && (
          <Button 
            size="sm" 
            onClick={() => onLink(person)}
          >
            <Building className="h-4 w-4 mr-1" /> Link
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonListItem;
