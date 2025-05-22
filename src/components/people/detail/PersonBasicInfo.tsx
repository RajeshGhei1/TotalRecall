
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Person } from '@/types/person';
import { Mail, Phone, MapPin } from 'lucide-react';
import JobHistoryList from '@/components/people/JobHistoryList';
import { JobHistoryItem } from '@/components/people/JobHistoryList';

interface PersonBasicInfoProps {
  person: Person;
  employmentHistory: JobHistoryItem[];
}

const PersonBasicInfo: React.FC<PersonBasicInfoProps> = ({ person, employmentHistory }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <Mail className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">{person.email}</p>
              <p className="text-xs text-muted-foreground">Email</p>
            </div>
          </div>
          {person.phone && (
            <div className="flex items-start">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{person.phone}</p>
                <p className="text-xs text-muted-foreground">Phone</p>
              </div>
            </div>
          )}
          {person.location && (
            <div className="flex items-start">
              <MapPin className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{person.location}</p>
                <p className="text-xs text-muted-foreground">Location</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional History</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {employmentHistory.length > 0 ? (
            <JobHistoryList jobHistory={employmentHistory} />
          ) : (
            <p className="text-sm text-muted-foreground px-6">No employment history found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonBasicInfo;
