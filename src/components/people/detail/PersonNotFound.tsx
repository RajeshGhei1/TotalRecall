
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonDetailBreadcrumb from './PersonDetailBreadcrumb';

const PersonNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <PersonDetailBreadcrumb />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="mb-4 text-muted-foreground">Person not found</p>
          <Button onClick={() => navigate('/superadmin/people')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to People
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default PersonNotFound;
