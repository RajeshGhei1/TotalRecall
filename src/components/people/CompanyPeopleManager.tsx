
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CompanyRelationship } from '@/types/company-relationship';
import { Talent } from '@/types/talent';

interface Person {
  id: string;
  full_name: string;
  email: string;
  type: 'talent' | 'contact';
}

interface CompanyPeopleManagerProps {
  companyId?: string;
  onAddPerson?: (person: Person, role: string) => void;
  onRemovePerson?: (personId: string) => void;
  relationships?: CompanyRelationship[];
  isLoading?: boolean;
}

const CompanyPeopleManager: React.FC<CompanyPeopleManagerProps> = ({
  companyId,
  onAddPerson,
  onRemovePerson,
  relationships = [],
  isLoading = false,
}) => {
  const [personType, setPersonType] = useState<'talent' | 'contact'>('talent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({});
  
  // Mock data for available people - in a real implementation, this would come from API
  const mockTalents: Person[] = [
    { id: 't1', full_name: 'John Doe', email: 'john@example.com', type: 'talent' },
    { id: 't2', full_name: 'Jane Smith', email: 'jane@example.com', type: 'talent' },
    { id: 't3', full_name: 'Michael Johnson', email: 'michael@example.com', type: 'talent' },
  ];

  const mockContacts: Person[] = [
    { id: 'c1', full_name: 'Alice Brown', email: 'alice@example.com', type: 'contact' },
    { id: 'c2', full_name: 'Bob Williams', email: 'bob@example.com', type: 'contact' },
    { id: 'c3', full_name: 'Charlie Davis', email: 'charlie@example.com', type: 'contact' },
  ];

  // Filter out people who are already associated with the company
  const existingPersonIds = relationships.map(r => r.person_id);
  
  // Filter available people based on search and existing relationships
  const filteredPeople = personType === 'talent'
    ? mockTalents
        .filter(p => !existingPersonIds.includes(p.id))
        .filter(p => 
          p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : mockContacts
        .filter(p => !existingPersonIds.includes(p.id))
        .filter(p => 
          p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Handle role input change for a person
  const handleRoleChange = (personId: string, role: string) => {
    setSelectedRole({
      ...selectedRole,
      [personId]: role
    });
  };

  // Handle adding a person to the company
  const handleAddPerson = (person: Person) => {
    const role = selectedRole[person.id] || '';
    if (onAddPerson) {
      onAddPerson(person, role);
    }
    // Clear the role for this person
    const newSelectedRoles = { ...selectedRole };
    delete newSelectedRoles[person.id];
    setSelectedRole(newSelectedRoles);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={personType} onValueChange={(value) => setPersonType(value as 'talent' | 'contact')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="talent">Talent</TabsTrigger>
          <TabsTrigger value="contact">Business Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="talent" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search talents..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-md overflow-hidden">
            {filteredPeople.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No talents found matching your search
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 pl-4">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="p-2 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeople.map(person => (
                    <tr key={person.id} className="border-t">
                      <td className="p-2 pl-4">{person.full_name}</td>
                      <td className="p-2">{person.email}</td>
                      <td className="p-2 w-48">
                        <Input 
                          placeholder="Role in company" 
                          value={selectedRole[person.id] || ''}
                          onChange={(e) => handleRoleChange(person.id, e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddPerson(person)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search business contacts..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-md overflow-hidden">
            {filteredPeople.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No business contacts found matching your search
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 pl-4">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="p-2 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeople.map(person => (
                    <tr key={person.id} className="border-t">
                      <td className="p-2 pl-4">{person.full_name}</td>
                      <td className="p-2">{person.email}</td>
                      <td className="p-2 w-48">
                        <Input 
                          placeholder="Role in company" 
                          value={selectedRole[person.id] || ''}
                          onChange={(e) => handleRoleChange(person.id, e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddPerson(person)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Associated People</h3>
        
        {relationships.length === 0 ? (
          <div className="p-4 border rounded-md text-center text-muted-foreground">
            No people are currently associated with this company
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 pl-4">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Relationship</th>
                  <th className="p-2 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Here we would map over the actual relationships data */}
                <tr className="border-t">
                  <td className="p-2 pl-4">John Doe</td>
                  <td className="p-2">john@example.com</td>
                  <td className="p-2">Software Engineer</td>
                  <td className="p-2">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      Current Employee
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemovePerson && onRemovePerson('t1')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-2 pl-4">Bob Williams</td>
                  <td className="p-2">bob@example.com</td>
                  <td className="p-2">Account Manager</td>
                  <td className="p-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      Business Contact
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemovePerson && onRemovePerson('c2')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPeopleManager;
