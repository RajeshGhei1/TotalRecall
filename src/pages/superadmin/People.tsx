
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import CompanyLinkForm from '@/components/people/CompanyLinkForm';
import PeopleActionBar from '@/components/people/PeopleActionBar';
import PeopleTabsContent from '@/components/people/PeopleTabsContent';
import BulkUploadDialog from '@/components/common/BulkUploadDialog';
import ApiConnectionDialog from '@/components/common/ApiConnectionDialog';

// Create a client
const queryClient = new QueryClient();

const People = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [personType, setPersonType] = useState<'talent' | 'contact'>('talent');
  const [isCompanyLinkFormOpen, setIsCompanyLinkFormOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isApiConnectionOpen, setIsApiConnectionOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    
    fetchCompanies();
  }, []);

  // Reset activeTab to dashboard when switching person type
  useEffect(() => {
    setActiveTab('dashboard');
  }, [personType]);

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
            companyFilter={companyFilter}
            setCompanyFilter={setCompanyFilter}
            companyOptions={companies}
            onBulkUpload={() => setIsBulkUploadOpen(true)}
            onApiConnection={() => setIsApiConnectionOpen(true)}
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
            onSubmit={() => {}}
            companies={companies}
            personType={personType}
            personId={selectedPersonId || undefined}
            isSubmitting={false}
          />

          {/* Bulk upload dialog */}
          <BulkUploadDialog 
            isOpen={isBulkUploadOpen}
            onClose={() => setIsBulkUploadOpen(false)}
            entityType={personType}
          />

          {/* API connection dialog */}
          <ApiConnectionDialog 
            isOpen={isApiConnectionOpen}
            onClose={() => setIsApiConnectionOpen(false)}
            entityType={personType}
          />
        </div>
      </QueryClientProvider>
    </AdminLayout>
  );
};

export default People;
