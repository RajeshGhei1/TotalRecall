
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Trash2, Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Person } from '@/types/person';
import CurrentCompanyBadge from '../CurrentCompanyBadge';

interface PeopleTableProps {
  people: Person[];
  onLinkToCompany: (id: string) => void;
  onDeletePerson: (id: string) => void;
  onEditPerson: (person: Person)) => void;
  onViewPerson: (id: string) => void;
}

const PeopleTable: React.FC<PeopleTableProps> = ({
  people,
  onLinkToCompany,
  onDeletePerson,
  onEditPerson,
  onViewPerson
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell>
                <div 
                  className="font-medium cursor-pointer text-primary hover:underline"
                  onClick={() => onViewPerson(person.id)}
                >
                  {person.full_name}
                  {person.current_company && (
                    <span className="ml-2">
                      <CurrentCompanyBadge
                        companyName={person.current_company.name}
                        role={person.current_company.role}
                      />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.phone || '-'}</TableCell>
              <TableCell>{person.location || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onLinkToCompany(person.id)}
                  >
                    <Building className="h-4 w-4 mr-2" /> Link to Company
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditPerson(person)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDeletePerson(person.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PeopleTable;
