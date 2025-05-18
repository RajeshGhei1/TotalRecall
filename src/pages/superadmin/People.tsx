
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Building } from 'lucide-react';
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CompanyLinkForm from '@/components/people/CompanyLinkForm';
import { toast } from 'sonner';
import CurrentCompanyBadge from '@/components/people/CurrentCompanyBadge';

// Create a client
const queryClient = new QueryClient();

const People = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [personType, setPersonType] = useState('talent'); // 'talent' or 'contact'
  const [isCompanyLinkFormOpen, setIsCompanyLinkFormOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // Function to handle linking a person to a company
  const handleLinkToCompany = (personId: string) => {
    setSelectedPersonId(personId);
    setIsCompanyLinkFormOpen(true);
  };

  const handleAddPerson = () => {
    // Logic to add a new person based on the current type
    if (personType === 'talent') {
      // Navigate to add talent form
      toast.info("Add talent functionality will be implemented soon");
    } else {
      // Navigate to add contact form
      toast.info("Add contact functionality will be implemented soon");
    }
  };

  // Mock function for handling company link submission
  const handleCompanyLinkSubmit = (values: any) => {
    console.log("Linking person to company:", selectedPersonId, values);
    
    // Here you would make an API call to save the relationship
    toast.success("Person linked to company successfully!");
    setIsCompanyLinkFormOpen(false);
    setSelectedPersonId(null);
  };

  return (
    <AdminLayout>
      <QueryClientProvider client={queryClient}>
        <div className="p-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>People</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">People Management</h1>
            <p className="text-muted-foreground">Manage talents and business contacts across the JobMojo platform.</p>
          </div>

          {/* Person type selector */}
          <div className="mb-6">
            <Tabs defaultValue="talent" onValueChange={setPersonType} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="talent">Talent Pool</TabsTrigger>
                <TabsTrigger value="contact">Business Contacts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex justify-between mb-6">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Search ${personType === 'talent' ? 'talents' : 'contacts'}...`} 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddPerson}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add {personType === 'talent' ? 'Talent' : 'Contact'}
            </Button>
          </div>

          {personType === 'talent' ? (
            <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">Talent Dashboard</TabsTrigger>
                <TabsTrigger value="all">All Talents</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="new">New Applications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <TalentMetricsDashboard />
              </TabsContent>
              
              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>All Talents</CardTitle>
                    <CardDescription>View and manage all talents registered in the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PeopleList 
                      personType="talent" 
                      onLinkToCompany={handleLinkToCompany} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="active">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Talents</CardTitle>
                    <CardDescription>View and manage currently active talents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No active talents found.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="inactive">
                <Card>
                  <CardHeader>
                    <CardTitle>Inactive Talents</CardTitle>
                    <CardDescription>View and manage inactive talents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No inactive talents found.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="new">
                <Card>
                  <CardHeader>
                    <CardTitle>New Applications</CardTitle>
                    <CardDescription>View and process new talent applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No new applications found.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Contacts</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="prospects">Prospects</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>All Business Contacts</CardTitle>
                    <CardDescription>View and manage all business contacts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PeopleList 
                      personType="contact" 
                      onLinkToCompany={handleLinkToCompany} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="clients">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Contacts</CardTitle>
                    <CardDescription>View and manage client contacts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No client contacts found.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="prospects">
                <Card>
                  <CardHeader>
                    <CardTitle>Prospect Contacts</CardTitle>
                    <CardDescription>View and manage prospect contacts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No prospect contacts found.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="vendors">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Contacts</CardTitle>
                    <CardDescription>View and manage vendor contacts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No vendor contacts found.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Company link form */}
          <CompanyLinkForm 
            isOpen={isCompanyLinkFormOpen}
            onClose={() => setIsCompanyLinkFormOpen(false)}
            onSubmit={handleCompanyLinkSubmit}
            companies={[
              { id: '1', name: 'Acme Corp' },
              { id: '2', name: 'Globex Corporation' },
              { id: '3', name: 'Initech' },
              { id: '4', name: 'Umbrella Corporation' },
            ]}
            personType={personType as 'talent' | 'contact'}
            isSubmitting={false}
          />
        </div>
      </QueryClientProvider>
    </AdminLayout>
  );
};

// Component to display the list of people (talents or contacts)
const PeopleList = ({ personType, onLinkToCompany }: { personType: string, onLinkToCompany: (id: string) => void }) => {
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

export default People;
