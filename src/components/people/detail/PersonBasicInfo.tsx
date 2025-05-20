
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from 'lucide-react';
import { Person } from '@/types/person';

interface PersonBasicInfoProps {
  person: Person;
}

const PersonBasicInfo: React.FC<PersonBasicInfoProps> = ({ person }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{person.email}</span>
          </div>
          
          {person?.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{person.phone}</span>
            </div>
          )}
          
          {person?.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{person.location}</span>
            </div>
          )}
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-1">Created</p>
            <p>{new Date(person.created_at).toLocaleDateString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <p>{new Date(person.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonBasicInfo;
