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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { QueryErrorDisplay } from '@/components/ui/error-display';
import { CompanyLinkForm } from '@/components/people/companyLink';
import PeopleActionBar from '@/components/people/PeopleActionBar';
import PeopleTabsContent from '@/components/people/PeopleTabsContent';
import BulkUploadDialog from '@/components/common/BulkUploadDialog';
import ApiConnectionDialog from '@/components/common/ApiConnectionDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatePersonDialog } from '@/components/people/personForm';

// Create a client
const queryClient = new QueryClient();

const People = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  // Fixed to only handle business contacts
  const personType = 'contact';
  const [isCompanyLinkFormOpen, setIsCompanyLinkFormOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isApiConnectionOpen, setIsApiConnectionOpen] = useState(false);
  const [isCreatePersonDialogOpen, setIsCreatePersonDialogOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<Error | null>(null);

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      setCompaniesError(null);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompaniesError(error as Error);
        toast.error('Failed to load companies');
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    
    fetchCompanies();
  }, []);

  // Reset activeTab to dashboard when component mounts
  useEffect(() => {
    setActiveTab('dashboard');
  }, []);

  // Function to handle linking a person to a company
  const handleLinkToCompany = (personId: string) => {
    setSelectedPersonId(personId);
    setIsCompanyLinkFormOpen(true);
  };

  const handleAddPerson = () => {
    setIsCreatePersonDialogOpen(true);
  };

  const handlePersonCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['people', personType] });
    toast.success(`${personType === 'talent' ? 'Talent' : 'Contact'} added successfully`);
    setIsCreatePersonDialogOpen(false);
  };

  const handleRetryCompanies = () => {
    // Re-trigger the useEffect
    setCompanies([]);
    setCompanyFilter('all');
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <div className="p-3 sm:p-6">
            <Breadcrumb className="mb-4 md:mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Business Contacts</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Contacts Management</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Manage business contacts and company relationships across the platform.
              </p>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Talent management has been moved to the ATS module for better workflow integration. 
                  Access talent data through the ATS Core module in tenant admin portals.
                </p>
              </div>
            </div>

            {/* Company loading error */}
            {companiesError && (
              <QueryErrorDisplay
                error={companiesError}
                onRetry={handleRetryCompanies}
                entityName="companies"
                className="mb-4"
              />
            )}

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
              searchQuery={searchQuery}
              companyFilter={companyFilter}
            />

            {/* Company link form */}
            <CompanyLinkForm 
              isOpen={isCompanyLinkFormOpen}
              onClose={() => setIsCompanyLinkFormOpen(false)}
              onSubmit={() => {
                queryClient.invalidateQueries({ queryKey: ['people', personType] });
                setIsCompanyLinkFormOpen(false);
              }}
              companies={companies}
              personType={personType}
              personId={selectedPersonId || undefined}
              isSubmitting={false}
            />

            {/* Create person dialog */}
            <CreatePersonDialog
              isOpen={isCreatePersonDialogOpen}
              onClose={() => setIsCreatePersonDialogOpen(false)}
              onSuccess={handlePersonCreated}
              personType={personType}
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
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default People;
