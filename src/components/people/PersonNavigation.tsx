
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePeople } from '@/hooks/usePeople';

interface PersonNavigationProps {
  currentPersonId: string;
  personType?: 'talent' | 'contact';
}

const PersonNavigation: React.FC<PersonNavigationProps> = ({ 
  currentPersonId,
  personType
}) => {
  const navigate = useNavigate();
  const { people, isLoading } = usePeople(personType);
  
  // Find the current index in the people array
  const currentIndex = people.findIndex(person => person.id === currentPersonId);
  
  // Determine if we have previous or next records
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < people.length - 1 && currentIndex !== -1;
  
  // Get the previous and next person IDs
  const previousPersonId = hasPrevious ? people[currentIndex - 1].id : null;
  const nextPersonId = hasNext ? people[currentIndex + 1].id : null;
  
  const goToPrevious = () => {
    if (previousPersonId) {
      navigate(`/superadmin/people/${previousPersonId}`);
    }
  };
  
  const goToNext = () => {
    if (nextPersonId) {
      navigate(`/superadmin/people/${nextPersonId}`);
    }
  };
  
  if (isLoading || people.length <= 1) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPrevious}
        disabled={!hasPrevious}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <span className="text-sm text-muted-foreground">
        {currentIndex + 1} of {people.length}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNext}
        disabled={!hasNext}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default PersonNavigation;
