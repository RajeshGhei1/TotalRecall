
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import CompanyLinkForm from '@/components/people/CompanyLinkForm';
import PeopleActionBar from '@/components/people/PeopleActionBar';
import PeopleTabsContent from '@/components/people/PeopleTabsContent';

// Create a client
const queryClient = new QueryClient();

const People = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [personType, setPersonType] = useState<'talent' | 'contact'>('talent');
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
            <Tabs defaultValue={personType} onValueChange={(value) => setPersonType(value as 'talent' | 'contact')} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="talent">Talent Pool</TabsTrigger>
                <TabsTrigger value="contact">Business Contacts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <PeopleActionBar 
            personType={personType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddPerson={handleAddPerson}
          />

          <PeopleTabsContent
            personType={personType}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLinkToCompany={handleLinkToCompany}
          />

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
            personType={personType}
            isSubmitting={false}
          />
        </div>
      </QueryClientProvider>
    </AdminLayout>
  );
};

export default People;
