
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'sonner';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import CompanyLinkForm from './CompanyLinkForm';
import PersonEditDialog from './personForm/PersonEditDialog';
import { usePersonQuery } from '@/hooks/people/usePersonQuery';
import PersonNavigation from './PersonNavigation';
import PersonBasicInfo from './detail/PersonBasicInfo';
import PersonTabsContent from './detail/PersonTabsContent';
import PersonHeader from './detail/PersonHeader';
import PersonDetailBreadcrumb from './detail/PersonDetailBreadcrumb';
import PersonDetailSkeleton from './detail/PersonDetailSkeleton';
import PersonNotFound from './detail/PersonNotFound';

const PersonDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const [isCompanyLinkFormOpen, setIsCompanyLinkFormOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  
  const { data: person, isLoading: loading } = usePersonQuery(id);
  
  const { usePersonEmploymentHistory } = useCompanyPeopleRelationship();
  const { data: employmentHistory, isLoading: loadingHistory } = usePersonEmploymentHistory(id);
  
  // Fetch companies for the dropdown in the company link form
  useEffect(() => {
    const fetchCompanies = async () => {
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
      }
    };
    
    fetchCompanies();
  }, []);

  const handleAddEmployment = () => {
    setIsCompanyLinkFormOpen(true);
  };

  const handleCompanyLinkSuccess = () => {
    setIsCompanyLinkFormOpen(false);
    // The query is automatically invalidated in the useCompanyPeopleRelationship hook
  };

  const handleEditPerson = () => {
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <PersonDetailSkeleton />
        </div>
      </AdminLayout>
    );
  }

  if (!person) {
    return (
      <AdminLayout>
        <div className="p-6">
          <PersonNotFound />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <PersonDetailBreadcrumb personName={person?.full_name} />
        
        {/* Person navigation */}
        <div className="mb-6">
          {id && <PersonNavigation currentPersonId={id} personType={person?.type} />}
        </div>
        
        <PersonHeader person={person} onEdit={handleEditPerson} />
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column - Basic Info */}
          <PersonBasicInfo person={person} />
          
          {/* Right column - Tabs */}
          <PersonTabsContent 
            person={person}
            employmentHistory={employmentHistory || []}
            loadingHistory={loadingHistory}
            onAddCompany={handleAddEmployment}
          />
        </div>

        {/* Company link form */}
        <CompanyLinkForm 
          isOpen={isCompanyLinkFormOpen}
          onClose={() => setIsCompanyLinkFormOpen(false)}
          onSubmit={handleCompanyLinkSuccess}
          companies={companies}
          personType={person?.type}
          personId={id}
          isSubmitting={false}
        />

        {/* Person edit dialog */}
        <PersonEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          person={person}
        />
      </div>
    </AdminLayout>
  );
};

export default PersonDetailView;
