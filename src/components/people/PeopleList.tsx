
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import CurrentCompanyBadge from './CurrentCompanyBadge';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PeopleListProps {
  personType: 'talent' | 'contact';
  onLinkToCompany: (id: string) => void;
}

const PeopleList = ({ personType, onLinkToCompany }: PeopleListProps) => {
  const isMobile = useIsMobile();

  // Mock data for talents and contacts
  const mockTalents = [
    { id: 't1', full_name: 'John Doe', email: 'john@example.com', location: 'New York', years_of_experience: 5 },
    { id: 't2', full_name: 'Jane Smith', email: 'jane@example.com', location: 'San Francisco', years_of_experience: 8 },
    { id: 't3', full_name: 'Michael Johnson', email: 'michael@example.com', location: 'Chicago', years_of_experience: 3 },
  ];

  const mockContacts = [
    { id: 'c1', full_name: 'Alice Brown', email: 'alice@example.com', company: 'Acme Corp', position: 'HR Manager' },
    { id: 'c2', full_name: 'Bob Williams', email: 'bob@example.com', company: 'Globex', position: 'CEO' },
    { id: 'c3', full_name: 'Charlie Davis', email: 'charlie@example.com', company: 'Initech', position: 'CTO' },
  ];

  // Mock company data
  const mockCompanies = {
    't1': { name: 'Tech Corp', role: 'Senior Developer' },
    'c2': { name: 'Globex', role: 'CEO' },
  };

  // In a real implementation, this would be replaced with a query to get the data
  const data = personType === 'talent' ? mockTalents : mockContacts;

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {personType === 'talent' ? 'talents' : 'contacts'} found.</p>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((person) => (
          <div 
            key={person.id} 
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{person.full_name}</div>
                <div className="text-sm text-gray-500">{person.email}</div>
              </div>
              {mockCompanies[person.id as keyof typeof mockCompanies] && (
                <CurrentCompanyBadge 
                  companyName={mockCompanies[person.id as keyof typeof mockCompanies].name} 
                  role={mockCompanies[person.id as keyof typeof mockCompanies].role}
                />
              )}
            </div>
            
            <div className="text-sm mb-1">
              <span className="font-medium mr-1">
                {personType === 'talent' ? 'Location:' : 'Company:'}
              </span>
              {personType === 'talent' 
                ? (person as any).location 
                : (person as any).company}
            </div>
            
            <div className="text-sm mb-3">
              <span className="font-medium mr-1">
                {personType === 'talent' ? 'Experience:' : 'Position:'}
              </span>
              {personType === 'talent' 
                ? `${(person as any).years_of_experience} years` 
                : (person as any).position}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onLinkToCompany(person.id)}
              className="w-full"
            >
              <Building className="h-4 w-4 mr-2" /> Link to Company
            </Button>
          </div>
        ))}
      </div>
    );
  }
  
  // Desktop table view
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>{personType === 'talent' ? 'Location' : 'Company'}</TableHead>
            <TableHead>{personType === 'talent' ? 'Experience' : 'Position'}</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((person) => (
            <TableRow key={person.id}>
              <TableCell>
                <div className="flex items-center">
                  <div>
                    <div className="font-medium">
                      {person.full_name}
                      {mockCompanies[person.id as keyof typeof mockCompanies] && (
                        <span className="ml-2">
                          <CurrentCompanyBadge 
                            companyName={mockCompanies[person.id as keyof typeof mockCompanies].name} 
                            role={mockCompanies[person.id as keyof typeof mockCompanies].role} 
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>
                {personType === 'talent' 
                  ? (person as any).location 
                  : (person as any).company}
              </TableCell>
              <TableCell>
                {personType === 'talent' 
                  ? `${(person as any).years_of_experience} years` 
                  : (person as any).position}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onLinkToCompany(person.id)}
                >
                  <Building className="h-4 w-4 mr-2" /> Link to Company
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PeopleList;
