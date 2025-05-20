
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Trash2, Pencil } from 'lucide-react';
import { Person } from '@/types/person';
import CurrentCompanyBadge from '../CurrentCompanyBadge';

interface MobilePeopleCardsProps {
  people: Person[];
  onLinkToCompany: (id: string) => void;
  onDeletePerson: (id: string) => void;
  onEditPerson: (person: any) => void;
  onViewPerson: (id: string) => void;
}

const MobilePeopleCards: React.FC<MobilePeopleCardsProps> = ({
  people,
  onLinkToCompany,
  onDeletePerson,
  onEditPerson,
  onViewPerson
}) => {
  return (
    <div className="space-y-4">
      {people.map((person) => (
        <div 
          key={person.id} 
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <div 
              className="cursor-pointer" 
              onClick={() => onViewPerson(person.id)}
            >
              <div className="font-medium text-primary">{person.full_name}</div>
              <div className="text-sm text-gray-500">{person.email}</div>
            </div>
            {person.current_company && (
              <CurrentCompanyBadge 
                companyName={person.current_company.name}
                role={person.current_company.role}
              />
            )}
          </div>
          
          <div className="flex flex-col space-y-1 mb-3">
            {person.phone && (
              <div className="text-sm">
                <span className="font-medium mr-1">Phone:</span>
                {person.phone}
              </div>
            )}
            
            {person.location && (
              <div className="text-sm">
                <span className="font-medium mr-1">Location:</span>
                {person.location}
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onLinkToCompany(person.id)}
              className="w-full"
            >
              <Building className="h-4 w-4 mr-2" /> Link to Company
            </Button>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => onEditPerson(person)}
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                className="flex-1"
                onClick={() => onDeletePerson(person.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobilePeopleCards;
