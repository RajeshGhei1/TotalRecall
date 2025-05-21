
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, Building2, Edit, Trash, Users, MapPin, Mail, Phone, Link, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Company, useCompanies } from '@/hooks/useCompanies';
import { CompanyFormValues } from './schema';
import { useForm, FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import PeopleSection from './sections/PeopleSection';
import BasicInfoSection from './sections/BasicInfoSection';
import ContactDetailsSection from './sections/ContactDetailsSection';
import SocialMediaSection from './sections/SocialMediaSection';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import CompanyRelationshipAnalytics from './analytics/CompanyRelationshipAnalytics';

const CompanyDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { companies } = useCompanies();

  const form = useForm<CompanyFormValues>({
    defaultValues: {
      name: '',
      description: '',
      website: '',
      industry: '',
      size: '',
      location: '',
    }
  });

  useEffect(() => {
    if (!id) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setCompany(data as Company);
        form.reset(data as CompanyFormValues);
      } catch (error) {
        console.error('Error fetching company:', error);
        toast.error('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, form]);

  const handleEdit = () => {
    navigate(`/superadmin/companies/edit/${id}`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete any company relationships first
      const { error: relationshipsError } = await supabase
        .from('company_relationships')
        .delete()
        .eq('company_id', id!);
        
      if (relationshipsError) throw relationshipsError;
      
      // Then delete the company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id!);

      if (error) throw error;

      toast.success('Company deleted successfully');
      navigate('/superadmin/companies');
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(`Failed to delete company: ${error.message}`);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleBack = () => {
    navigate('/superadmin/companies');
  };

  // Company navigation
  const currentIndex = companies ? companies.findIndex(c => c.id === id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < companies?.length - 1 && currentIndex !== -1;
  
  const previousCompanyId = hasPrevious && companies ? companies[currentIndex - 1].id : null;
  const nextCompanyId = hasNext && companies ? companies[currentIndex + 1].id : null;
  
  const goToPrevious = () => {
    if (previousCompanyId) {
      navigate(`/superadmin/companies/${previousCompanyId}`);
    }
  };
  
  const goToNext = () => {
    if (nextCompanyId) {
      navigate(`/superadmin/companies/${nextCompanyId}`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!company) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Company Not Found</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">The company you're looking for doesn't exist or has been deleted.</p>
              <Button className="mt-4" onClick={handleBack}>Return to Companies</Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <FormProvider {...form}>
        <div className="p-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/companies">Companies</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{company.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Navigation between companies */}
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Company
            </Button>
            
            {companies && (
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {companies.length}
              </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={!hasNext}
            >
              Next Company
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
                <CardDescription>Basic information about the company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.description && (
                  <div>
                    <div className="font-medium text-sm text-muted-foreground mb-1">Description</div>
                    <p>{company.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {company.industry && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Industry</div>
                        <div>{company.industry}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.size && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Company Size</div>
                        <div>{company.size}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div>{company.location}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div>{company.email}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div>{company.phone}</div>
                      </div>
                    </div>
                  )}
                  
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Website</div>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key information at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatItem label="Founded" value={company.founded?.toString() || 'Unknown'} />
                <StatItem label="Registration" value={company.registrationDate || 'Unknown'} />
                <StatItem label="Global Region" value={company.globalRegion || 'Unknown'} />
                <StatItem label="Country" value={company.country || 'Unknown'} />
                <StatItem label="Employees" value={company.noOfEmployee || 'Unknown'} />
                <StatItem label="Turnover" value={company.turnover || 'Unknown'} />
                <StatItem label="CIN" value={company.cin || 'Unknown'} />
                <StatItem label="Status" value={company.companyStatus || 'Unknown'} />
              </CardContent>
            </Card>
          </div>
          
          {/* Company relationship analytics */}
          <div className="mb-6">
            {id && <CompanyRelationshipAnalytics companyId={id} />}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="people" className="mt-4">
              <PeopleSection form={form} showFullView={true} />
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Company Details</CardTitle>
                  <CardDescription>Extended information about this company</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic">
                    <TabsList className="mb-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="contact">Contact Details</TabsTrigger>
                      <TabsTrigger value="social">Social Media</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic">
                      <BasicInfoSection form={form} readOnly={true} />
                    </TabsContent>
                    
                    <TabsContent value="contact">
                      <ContactDetailsSection form={form} readOnly={true} />
                    </TabsContent>
                    
                    <TabsContent value="social">
                      <SocialMediaSection form={form} readOnly={true} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <CompanyDeleteDialog 
            company={company}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            companyName={company.name}
            isOpen={isDeleteDialogOpen}
          />
        </div>
      </FormProvider>
    </AdminLayout>
  );
};

// Helper component for stats
interface StatItemProps {
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  if (value === 'Unknown' || !value) return null;
  
  return (
    <div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};

export default CompanyDetailView;
