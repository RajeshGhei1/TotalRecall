
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePeople } from '@/hooks/usePeople';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import PersonEditDialog from './personForm/PersonEditDialog';
import MobilePeopleCards from './list/MobilePeopleCards';
import PeopleTable from './list/PeopleTable';
import DeletePersonDialog from './list/DeletePersonDialog';

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
  const [editPerson, setEditPerson] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    people,
    isLoadingPeople,
    isPeopleError,
    peopleError,
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

  const handleEditPerson = (person: any) => {
    setEditPerson(person);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditPerson(null);
  };

  if (isLoadingPeople) {
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

  if (isPeopleError) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading data: {(peopleError as Error).message}</p>
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

  return (
    <>
      {isMobile ? (
        <MobilePeopleCards
          people={people}
          onLinkToCompany={onLinkToCompany}
          onDeletePerson={handleDelete}
          onEditPerson={handleEditPerson}
          onViewPerson={handleViewPerson}
        />
      ) : (
        <PeopleTable
          people={people}
          onLinkToCompany={onLinkToCompany}
          onDeletePerson={handleDelete}
          onEditPerson={handleEditPerson}
          onViewPerson={handleViewPerson}
        />
      )}

      {/* Delete confirmation dialog */}
      <DeletePersonDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        personType={personType}
      />

      {/* Edit person dialog */}
      <PersonEditDialog
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
        person={editPerson}
      />
    </>
  );
};

export default PeopleList;
