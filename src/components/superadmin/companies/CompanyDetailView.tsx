
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { EditCompanyDialog } from './EditCompanyDialog';
import { useCompanies } from '@/hooks/useCompanies';
import { toast } from 'sonner';

const CompanyDetailView: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { updateCompany } = useCompanies();

  const { data: company, isLoading, error, refetch } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('Company ID is required');
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) throw error;
      return data as Company;
    },
    enabled: !!companyId,
  });

  const handleEditSubmit = async (data: any) => {
    if (!company) return;
    
    try {
      await updateCompany.mutateAsync({ id: company.id, companyData: data });
      setIsEditDialogOpen(false);
      refetch();
      toast.success('Company updated successfully');
    } catch (error) {
      toast.error('Failed to update company');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading company details...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading company details. Please try again.
        </div>
      </div>
    );
  }

  return (
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
        <Button onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Company
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                  <p className="text-lg font-semibold">{company.name}</p>
                </div>
                
                {company.website && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {company.website}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}

                {company.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${company.email}`} className="text-blue-600 hover:text-blue-800">
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}

                {company.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${company.phone}`} className="text-blue-600 hover:text-blue-800">
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}

                {company.location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                )}

                {company.size && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company Size</label>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <Badge variant="secondary">{company.size}</Badge>
                    </div>
                  </div>
                )}

                {company.founded && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Founded</label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{company.founded}</span>
                    </div>
                  </div>
                )}
              </div>

              {company.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm text-gray-700">{company.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Industry Information */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {company.industry1 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Primary Industry</label>
                    <Badge variant="outline" className="mt-1">{company.industry1}</Badge>
                  </div>
                )}
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
                {company.companysector && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company Sector</label>
                    <Badge variant="outline" className="mt-1">{company.companysector}</Badge>
                  </div>
                )}
                {company.companytype && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company Type</label>
                    <Badge variant="outline" className="mt-1">{company.companytype}</Badge>
                  </div>
                )}
                {company.entitytype && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                    <Badge variant="outline" className="mt-1">{company.entitytype}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.linkedin && (
                <a 
                  href={company.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn Profile
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              {company.twitter && (
                <a 
                  href={company.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter Profile
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              {company.facebook && (
                <a 
                  href={company.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook Page
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              {!company.linkedin && !company.twitter && !company.facebook && (
                <p className="text-muted-foreground text-sm">No social media links available</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.cin && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CIN</label>
                  <p className="text-sm">{company.cin}</p>
                </div>
              )}
              
              {company.companystatus && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant="outline">{company.companystatus}</Badge>
                </div>
              )}
              
              {company.registeredofficeaddress && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registered Address</label>
                  <p className="text-sm">{company.registeredofficeaddress}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(company.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
    </div>
  );
};

export default CompanyDetailView;
