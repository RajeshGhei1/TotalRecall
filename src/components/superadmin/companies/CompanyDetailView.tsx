
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
  Linkedin,
  Twitter,
  Facebook,
  Network,
  FileText,
  Activity
} from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { EditCompanyDialog } from './EditCompanyDialog';
import { useCompanies } from '@/hooks/useCompanies';
import { toast } from 'sonner';
import PeopleSection from './sections/PeopleSection';
import RelationshipsSection from './sections/RelationshipsSection';
import CompanyOrgChart from '@/components/orgchart/CompanyOrgChart';

const CompanyDetailView: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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

  const handleEditSubmit = async (data: unknown) => {
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

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Associations
          </TabsTrigger>
          <TabsTrigger value="orgchart" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Org Chart
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact & Social
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {company.noofemployee && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Employees</span>
                      <span className="font-medium">{company.noofemployee}</span>
                    </div>
                  )}
                  {company.turnover && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Turnover</span>
                      <span className="font-medium">{company.turnover}</span>
                    </div>
                  )}
                  {company.hierarchy_level !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Hierarchy Level</span>
                      <Badge variant="outline">Level {company.hierarchy_level}</Badge>
                    </div>
                  )}
                  {company.company_group_name && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Group</span>
                      <span className="font-medium">{company.company_group_name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {company.companystatus && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge variant="outline">{company.companystatus}</Badge>
                    </div>
                  )}
                  {company.companytype && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Type</label>
                      <Badge variant="outline">{company.companytype}</Badge>
                    </div>
                  )}
                  {company.entitytype && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                      <Badge variant="outline">{company.entitytype}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* People Tab */}
        <TabsContent value="people">
          <PeopleSection 
            form={{ getValues: () => ({ id: companyId }) } as unknown}
            showFullView={true}
          />
        </TabsContent>

        {/* Relationships/Associations Tab */}
        <TabsContent value="relationships">
          <RelationshipsSection 
            companyId={companyId!}
            companyName={company.name}
          />
        </TabsContent>

        {/* Org Chart Tab */}
        <TabsContent value="orgchart">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Organization Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyOrgChart companyId={companyId!} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Info Tab */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.turnover && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Turnover</label>
                    <p className="font-medium">{company.turnover}</p>
                  </div>
                )}
                {company.turnoveryear && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Turnover Year</label>
                    <p className="font-medium">{company.turnoveryear}</p>
                  </div>
                )}
                {company.paidupcapital && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Paid Up Capital</label>
                    <p className="font-medium">{company.paidupcapital}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.areaofspecialize && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Area of Specialization</label>
                    <p className="text-sm">{company.areaofspecialize}</p>
                  </div>
                )}
                {company.serviceline && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Service Line</label>
                    <p className="text-sm">{company.serviceline}</p>
                  </div>
                )}
                {company.verticles && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Verticals</label>
                    <p className="text-sm">{company.verticles}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Geographic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.country && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="font-medium">{company.country}</p>
                  </div>
                )}
                {company.region && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Region/State</label>
                    <p className="font-medium">{company.region}</p>
                  </div>
                )}
                {company.globalregion && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Global Region</label>
                    <p className="font-medium">{company.globalregion}</p>
                  </div>
                )}
                {company.holocation && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">HO Location</label>
                    <p className="font-medium">{company.holocation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Legal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.cin && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CIN</label>
                    <p className="font-medium">{company.cin}</p>
                  </div>
                )}
                {company.registrationdate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                    <p className="font-medium">{new Date(company.registrationdate).toLocaleDateString()}</p>
                  </div>
                )}
                {company.registeredofficeaddress && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registered Office Address</label>
                    <p className="text-sm">{company.registeredofficeaddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact & Social Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${company.email}`} className="text-blue-600 hover:text-blue-800">
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${company.phone}`} className="text-blue-600 hover:text-blue-800">
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.registeredemailaddress && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registered Email</label>
                    <p className="text-sm">{company.registeredemailaddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media & Online Presence</CardTitle>
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
          </div>
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
    </div>
  );
};

export default CompanyDetailView;
