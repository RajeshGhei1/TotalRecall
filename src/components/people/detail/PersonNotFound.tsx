
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

interface PersonNotFoundProps {
  onBack: () => void;
}

const PersonNotFound: React.FC<PersonNotFoundProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Person Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The person you're looking for could not be found. They may have been removed or you might have an incorrect URL.
      </p>
      <Button onClick={onBack}>
        Go Back
      </Button>
    </div>
  );
};

export default PersonNotFound;
