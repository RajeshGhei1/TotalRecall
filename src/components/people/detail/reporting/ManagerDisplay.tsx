
import React from 'react';
import PersonCard from './PersonCard';

interface ReportingPerson {
  id: string;
  full_name: string;
  email?: string | null;
  type?: string;
  role?: string;
}

interface ManagerDisplayProps {
  manager: ReportingPerson | null;
}

const ManagerDisplay: React.FC<ManagerDisplayProps> = ({ manager }) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">Reports To</div>
      {manager ? (
        <PersonCard 
          id={manager.id}
          fullName={manager.full_name}
          email={manager.email}
          role={manager.role}
        />
      ) : (
        <div className="border rounded-md p-3 text-center text-muted-foreground">
          No manager assigned
        </div>
      )}
    </div>
  );
};

export default ManagerDisplay;
