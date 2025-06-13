
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Person } from '@/types/person';
import { Eye, Edit, Trash2, Link } from 'lucide-react';

interface PeopleTableProps {
  people: Person[];
  onLinkToCompany: (id: string) => void;
  onDeletePerson: (id: string) => void;
  onEditPerson: (person: Person) => void;
  onViewPerson: (id: string) => void;
}

const PeopleTable = ({ 
  people, 
  onLinkToCompany, 
  onDeletePerson, 
  onEditPerson, 
  onViewPerson 
}: PeopleTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>TR ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Current Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {person.full_name}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono text-xs">
                  {person.tr_id || 'No TR ID'}
                </Badge>
              </TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.phone || '-'}</TableCell>
              <TableCell>
                {person.current_company ? (
                  <div>
                    <div className="font-medium">{person.current_company.name}</div>
                    <div className="text-sm text-muted-foreground">{person.current_company.role}</div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">No company</span>
                )}
              </TableCell>
              <TableCell>{person.location || '-'}</TableCell>
              <TableCell>
                <Badge variant={person.type === 'talent' ? 'default' : 'outline'}>
                  {person.type}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPerson(person.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPerson(person)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLinkToCompany(person.id)}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
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
