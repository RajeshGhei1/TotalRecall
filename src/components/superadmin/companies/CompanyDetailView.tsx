import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Users,
  Edit,
  ArrowLeft,
  ExternalLink,
  Network,
  History
} from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { EditCompanyDialog } from './EditCompanyDialog';
import { useCompanies } from '@/hooks/useCompanies';
import { toast } from 'sonner';
import CompanyPeopleManager from '@/components/people/CompanyPeopleManager';
import CompanyOrgChart from '@/components/orgchart/CompanyOrgChart';
import RelationshipsSection from './sections/RelationshipsSection';
import { SecureErrorBoundary } from '@/components/common/SecureErrorBoundary';
import { useSecureActions } from '@/hooks/security/useSecureActions';
import { useConfirmation } from '@/hooks/common/useConfirmation';
import { usePermissionCheck } from '@/hooks/security/useSecurityContext';

const CompanyDetailView: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { updateCompany } = useCompanies();
  const { executeSecureAction } = useSecureActions();
  const { ConfirmationComponent } = useConfirmation();
  const { hasPermission } = usePermissionCheck();

  // Check permissions
  const canViewCompany = hasPermission('companies', 'view');
  const canEditCompany = hasPermission('companies', 'edit');

  const { data: company, isLoading, error, refetch } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('Company ID is required');
      if (!canViewCompany) throw new Error('Permission denied');
      
      console.log('Fetching company with ID:', companyId);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company:', error);
        throw error;
      }
      
      console.log('Company data retrieved:', data);
      return data as Company;
    },
    enabled: !!companyId && canViewCompany,
  });

  const handleEditSubmit = async (data: any) => {
    if (!company) return;
    
    const result = await executeSecureAction(
      () => updateCompany.mutateAsync({ id: company.id, ...data }),
      {
        requireConfirmation: true,
        confirmationTitle: 'Update Company',
        confirmationDescription: 'Are you sure you want to update this company information?',
        severity: 'info',
        requiredPermission: {
          resource: 'companies',
          action: 'edit',
        },
        auditAction: {
          action: 'UPDATE',
          entity: 'company',
          entityId: company.id,
          severity: 'medium',
          metadata: { companyName: company.name },
        },
      }
    );

    if (result) {
      setIsEditDialogOpen(false);
      refetch();
      toast.success('Company updated successfully');
    }
  };

  const handleEditClick = () => {
    if (!canEditCompany) {
      toast.error('Permission denied', {
        description: 'You do not have permission to edit companies',
      });
      return;
    }
    setIsEditDialogOpen(true);
  };

  if (!canViewCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-4">
            <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You do not have permission to view company details.
            </p>
            <Button onClick={() => navigate('/superadmin/companies')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <SecureErrorBoundary>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4">
              <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Company</h2>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
              <Button onClick={() => navigate('/superadmin/companies')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </Button>
            </div>
          </div>
        </div>
      </SecureErrorBoundary>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Company Not Found</h2>
          <p className="text-gray-600 mb-4">
            The company you're looking for doesn't exist or may have been deleted.
          </p>
          <Button onClick={() => navigate('/superadmin/companies')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SecureErrorBoundary>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/superadmin/companies')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <p className="text-muted-foreground">Company Details</p>
            </div>
          </div>
          {canEditCompany && (
            <Button onClick={handleEditClick}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Company
            </Button>
          )}
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="people">
              <Users className="h-4 w-4 mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger value="orgchart">
              <Network className="h-4 w-4 mr-2" />
              Org Chart
            </TabsTrigger>
            <TabsTrigger value="relationships">
              <Building className="h-4 w-4 mr-2" />
              Relationships
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Company Overview Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {company.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {company.tr_id || 'No TR ID'}
                        </Badge>
                        {company.cin && (
                          <Badge variant="outline" className="text-xs">
                            CIN: {company.cin}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {company.industry1 && (
                      <Badge variant="default">{company.industry1}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {company.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate flex items-center gap-1"
                        >
                          {company.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {company.founded && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Founded {company.founded}</span>
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{company.size}</span>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${company.email}`}
                          className="text-blue-600 hover:underline truncate"
                        >
                          {company.email}
                        </a>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {company.description && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        {company.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created: {new Date(company.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(company.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Company Information */}
              {(company.industry2 || company.industry3 || company.companystatus || company.companytype) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.industry2 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Secondary Industry</label>
                          <Badge variant="outline" className="mt-1">{company.industry2}</Badge>
                        </div>
                      )}
                      {company.industry3 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tertiary Industry</label>
                          <Badge variant="outline" className="mt-1">{company.industry3}</Badge>
                        </div>
                      )}
                      {company.companystatus && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <Badge variant="outline" className="mt-1">{company.companystatus}</Badge>
                        </div>
                      )}
                      {company.companytype && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Type</label>
                          <Badge variant="outline" className="mt-1">{company.companytype}</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <SecureErrorBoundary>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Company People
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CompanyPeopleManager companyId={companyId!} />
                </CardContent>
              </Card>
            </SecureErrorBoundary>
          </TabsContent>

          <TabsContent value="orgchart" className="mt-6">
            <SecureErrorBoundary>
              <CompanyOrgChart companyId={companyId!} />
            </SecureErrorBoundary>
          </TabsContent>

          <TabsContent value="relationships" className="mt-6">
            <SecureErrorBoundary>
              <RelationshipsSection companyId={companyId!} companyName={company.name} />
            </SecureErrorBoundary>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Company History & Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">History Tracking</p>
                  <p className="text-sm">Company change history and audit logs will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {isEditDialogOpen && (
          <EditCompanyDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            company={company}
            onSubmit={handleEditSubmit}
            isSubmitting={updateCompany.isPending}
          />
        )}

        <ConfirmationComponent />
      </div>
    </SecureErrorBoundary>
  );
};

export default CompanyDetailView;
