
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface PersonNotFoundProps {
  onBack: () => void;
}

const PersonNotFound: React.FC<PersonNotFoundProps> = ({ onBack }) => {
  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Person Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The person you are looking for doesn't exist or has been removed.
      </p>
      <Button onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to People
      </Button>
    </div>
  );
};

export default PersonNotFound;
