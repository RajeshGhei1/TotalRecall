
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, Trash2, Pencil } from 'lucide-react';
import CurrentCompanyBadge from './CurrentCompanyBadge';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePeople } from '@/hooks/usePeople';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';

interface PeopleListProps {
  personType: 'talent' | 'contact';
  onLinkToCompany: (id: string) => void;
  searchQuery?: string;
  companyFilter?: string;
}

const PeopleList = ({ personType, onLinkToCompany, searchQuery, companyFilter }: PeopleListProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);

  const {
    people,
    isLoading,
    isError,
    error,
    deletePerson
  } = usePeople(personType, searchQuery, companyFilter);

  const handleDelete = (id: string) => {
    setPersonToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (personToDelete) {
      deletePerson.mutate(personToDelete);
    }
    setDeleteDialogOpen(false);
    setPersonToDelete(null);
  };
  
  const handleViewPerson = (id: string) => {
    navigate(`/superadmin/people/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading data: {(error as Error).message}</p>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {personType === 'talent' ? 'talents' : 'contacts'} found.</p>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
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
                onClick={() => handleViewPerson(person.id)}
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
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(person.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Desktop table view
  return (
    <>
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
                    onClick={() => handleViewPerson(person.id)}
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
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(person.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {personType === 'talent' ? 'talent' : 'contact'} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PeopleList;
