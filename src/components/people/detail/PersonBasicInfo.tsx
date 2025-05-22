
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { Person } from '@/types/person';
import CompanyRelationshipCard from './CompanyRelationshipCard';

interface PersonBasicInfoProps {
  person: Person;
}

const PersonBasicInfo: React.FC<PersonBasicInfoProps> = ({ person }) => {
  const { usePersonEmploymentHistory } = useCompanyPeopleRelationship();
  const { data: employmentHistory } = usePersonEmploymentHistory(person.id);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{person.email}</div>
          </div>
          
          {person.phone && (
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="font-medium">{person.phone}</div>
            </div>
          )}
          
          {person.location && (
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium">{person.location}</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Current company quick view with navigation */}
      <CompanyRelationshipCard jobHistory={employmentHistory || []} />
    </div>
  );
};

export default PersonBasicInfo;
