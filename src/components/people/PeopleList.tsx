
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import CurrentCompanyBadge from './CurrentCompanyBadge';

interface PeopleListProps {
  personType: 'talent' | 'contact';
  onLinkToCompany: (id: string) => void;
}

const PeopleList = ({ personType, onLinkToCompany }: PeopleListProps) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {personType === 'talent' ? 'Location' : 'Company'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {personType === 'talent' ? 'Experience' : 'Position'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((person) => (
            <tr key={person.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {person.full_name}
                      {/* Show company badge if they have a current company */}
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
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{person.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {personType === 'talent' 
                    ? (person as any).location 
                    : (person as any).company}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {personType === 'talent' 
                    ? `${(person as any).years_of_experience} years` 
                    : (person as any).position}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" size="sm" onClick={() => onLinkToCompany(person.id)}>
                  <Building className="h-4 w-4 mr-2" /> Link to Company
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeopleList;
