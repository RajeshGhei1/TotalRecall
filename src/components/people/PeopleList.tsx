
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePeople } from '@/hooks/usePeople';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryErrorDisplay } from '@/components/ui/error-display';
import { ErrorBoundary } from '@/components/ui/error-boundary';
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

  const handleEditPerson = (person: any) => {
    setEditPerson(person);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditPerson(null);
  };

  const handleRetry = () => {
    // This will trigger a refetch of the query
    window.location.reload();
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
      <QueryErrorDisplay
        error={error}
        onRetry={handleRetry}
        entityName={personType === 'talent' ? 'talents' : 'contacts'}
        className="my-8"
      />
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default PeopleList;
