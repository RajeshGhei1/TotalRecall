
import React, { useState, useEffect } from 'react';
import { Person } from '@/types/person';
import { QueryErrorDisplay } from '@/components/ui/error-display';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface PeopleRelationshipListProps {
  relationships: any[];
}

const PeopleRelationshipList: React.FC<PeopleRelationshipListProps> = ({ relationships }) => {
  const [peopleData, setPeopleData] = useState<Record<string, Person>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        setError(null);
        const personIds = relationships.map(rel => rel.person_id);
        
        if (personIds.length === 0) {
          setLoading(false);
          return;
        }
        
        const { data, error: fetchError } = await supabase
          .from('people')
          .select('*')
          .in('id', personIds);
          
        if (fetchError) throw fetchError;
          
        if (data) {
          const peopleMap: Record<string, Person> = {};
          data.forEach(person => {
            peopleMap[person.id] = person as Person;
          });
          setPeopleData(peopleMap);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching people data:', error);
        setError(error as Error);
        setLoading(false);
      }
    };
    
    fetchPeopleData();
  }, [relationships]);
  
  if (loading) {
    return <PeopleRelationshipSkeleton />;
  }

  if (error) {
    return (
      <QueryErrorDisplay
        error={error}
        entityName="people details"
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  return (
    <div className="divide-y">
      {relationships.map(relationship => {
        const person = peopleData[relationship.person_id];
        
        if (!person) return null;
        
        return (
          <div key={relationship.id} className="py-4 flex justify-between items-start">
            <div>
              <div className="font-medium">{person.full_name}</div>
              <div className="text-sm text-muted-foreground">{person.email}</div>
              <div className="text-sm mt-1">
                <span className="font-medium">Role:</span> {relationship.role}
              </div>
              {relationship.start_date && (
                <div className="text-xs text-muted-foreground">
                  {relationship.is_current 
                    ? `Since ${new Date(relationship.start_date).toLocaleDateString()}`
                    : `${new Date(relationship.start_date).toLocaleDateString()} - ${relationship.end_date 
                        ? new Date(relationship.end_date).toLocaleDateString() 
                        : 'Unknown'}`
                  }
                </div>
              )}
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${
                person.type === 'talent' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {person.type === 'talent' ? 'Talent' : 'Contact'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper component for loading state
const PeopleRelationshipSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    ))}
  </div>
);

export default PeopleRelationshipList;
