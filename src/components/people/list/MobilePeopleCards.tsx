
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Person } from '@/types/person';
import { Eye, Edit, Trash2, Link, Mail, Phone, MapPin } from 'lucide-react';

interface MobilePeopleCardsProps {
  people: Person[];
  onLinkToCompany: (id: string) => void;
  onDeletePerson: (id: string) => void;
  onEditPerson: (person: Person) => void;
  onViewPerson: (id: string) => void;
}

const MobilePeopleCards = ({ 
  people, 
  onLinkToCompany, 
  onDeletePerson, 
  onEditPerson, 
  onViewPerson 
}: MobilePeopleCardsProps) => {
  return (
    <div className="space-y-4">
      {people.map((person) => (
        <Card key={person.id} className="p-4">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold">{person.full_name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={person.type === 'talent' ? 'default' : 'outline'}>
                    {person.type}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {person.tr_id || 'No TR ID'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{person.email}</span>
              </div>
              
              {person.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{person.phone}</span>
                </div>
              )}
              
              {person.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{person.location}</span>
                </div>
              )}
              
              {person.current_company && (
                <div className="mt-3 p-2 bg-muted rounded-md">
                  <div className="font-medium">{person.current_company.name}</div>
                  <div className="text-xs text-muted-foreground">{person.current_company.role}</div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => onViewPerson(person.id)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEditPerson(person)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onLinkToCompany(person.id)}>
                <Link className="h-4 w-4 mr-1" />
                Link
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDeletePerson(person.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobilePeopleCards;
