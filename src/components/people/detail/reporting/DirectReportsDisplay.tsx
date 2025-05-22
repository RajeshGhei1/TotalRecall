
import React from 'react';
import PersonCard from './PersonCard';

interface ReportingPerson {
  id: string;
  full_name: string;
  email?: string | null;
  type?: string;
  role?: string;
}

interface DirectReportsDisplayProps {
  directReports: ReportingPerson[];
}

const DirectReportsDisplay: React.FC<DirectReportsDisplayProps> = ({ directReports }) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">Direct Reports ({directReports.length})</div>
      {directReports.length > 0 ? (
        <div className="space-y-2">
          {directReports.map(report => (
            <PersonCard 
              key={report.id}
              id={report.id}
              fullName={report.full_name}
              email={report.email}
              role={report.role}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-3 text-center text-muted-foreground">
          No direct reports
        </div>
      )}
    </div>
  );
};

export default DirectReportsDisplay;
