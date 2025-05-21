
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import CompanyPeopleManager from '@/components/people/CompanyPeopleManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { Person } from '@/types/person';
import { Skeleton } from '@/components/ui/skeleton';

interface PeopleSectionProps {
  form: UseFormReturn<CompanyFormValues>;
  showFullView?: boolean;
}

const PeopleSection: React.FC<PeopleSectionProps> = ({ form, showFullView = false }) => {
  // Get company ID from form (for existing companies) or generate a temporary ID for new companies
  const formValues = form.getValues();
  // Use nullish coalescing to provide a fallback for the ID
  const companyId = formValues.id ?? 'new';
  
  const [activeTab, setActiveTab] = useState('current');
  const { relationships } = useCompanyPeopleRelationship(companyId);
  
  // Filter relationships by current and past
  const currentRelationships = relationships?.filter(rel => rel.is_current) || [];
  const pastRelationships = relationships?.filter(rel => !rel.is_current) || [];
  
  if (showFullView) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>People Associated with Company</CardTitle>
          <CardDescription>Manage and view all people associated with this company</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="current">Current People ({currentRelationships.length})</TabsTrigger>
              <TabsTrigger value="past">Past Associations ({pastRelationships.length})</TabsTrigger>
              <TabsTrigger value="manage">Manage Associations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <div className="space-y-4">
                {currentRelationships.length > 0 ? (
                  <PeopleRelationshipList relationships={currentRelationships} />
                ) : (
                  <div className="text-center p-4 text-muted-foreground rounded-md border">
                    No current people associated with this company
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              <div className="space-y-4">
                {pastRelationships.length > 0 ? (
                  <PeopleRelationshipList relationships={pastRelationships} />
                ) : (
                  <div className="text-center p-4 text-muted-foreground rounded-md border">
                    No past associations found
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="manage">
              <CompanyPeopleManager companyId={companyId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  
  // Simple view for the company form
  return (
    <CompanyPeopleManager companyId={companyId} />
  );
};

// Helper component to display people relationship list
interface PeopleRelationshipListProps {
  relationships: any[];
}

const PeopleRelationshipList: React.FC<PeopleRelationshipListProps> = ({ relationships }) => {
  const [peopleData, setPeopleData] = useState<Record<string, Person>>({});
  const [loading, setLoading] = useState(true);
  
  // Fetch people data for the relationships
  React.useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const personIds = relationships.map(rel => rel.person_id);
        
        const { data } = await supabase
          .from('people')
          .select('*')
          .in('id', personIds);
          
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
        setLoading(false);
      }
    };
    
    fetchPeopleData();
  }, [relationships]);
  
  if (loading) {
    return (
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

export default PeopleSection;
