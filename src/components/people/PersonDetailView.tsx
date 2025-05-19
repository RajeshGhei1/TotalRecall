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
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Building, Mail, Phone, MapPin } from 'lucide-react';
import JobHistoryList from './JobHistoryList';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';

// We'll implement this in a future iteration
const PersonDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  
  const { getPersonEmploymentHistory } = useCompanyPeopleRelationship();
  const [employmentHistory, setEmploymentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  useEffect(() => {
    const fetchPerson = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('people')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setPerson(data);
        
        // Fetch employment history
        setLoadingHistory(true);
        const history = await getPersonEmploymentHistory(id);
        setEmploymentHistory(history);
        setLoadingHistory(false);
      } catch (error) {
        console.error('Error fetching person:', error);
        toast.error('Failed to load person details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPerson();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/people">People</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <div className="grid gap-6 md:grid-cols-3 mt-6">
              <Skeleton className="h-[300px]" />
              <Skeleton className="h-[300px] md:col-span-2" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!person) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/people">People</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="mb-4 text-muted-foreground">Person not found</p>
              <Button onClick={() => navigate('/superadmin/people')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to People
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/people">People</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{person.full_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{person.full_name}</h1>
            <p className="text-muted-foreground">
              {person.type === 'talent' ? 'Talent' : 'Business Contact'}
            </p>
          </div>
          
          <Button variant="outline" onClick={() => navigate('/superadmin/people')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column - Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{person.email}</span>
                </div>
                
                {person.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{person.phone}</span>
                  </div>
                )}
                
                {person.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{person.location}</span>
                  </div>
                )}
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p>{new Date(person.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p>{new Date(person.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Right column - Tabs */}
          <Card className="md:col-span-2">
            <CardHeader className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="info"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                  >
                    Additional Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="companies"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                  >
                    Companies
                  </TabsTrigger>
                  {person.type === 'talent' && (
                    <TabsTrigger
                      value="skills"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                    >
                      Skills
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6">
              <TabsContent value="info" className="mt-0">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {person.type === 'talent'
                      ? 'Additional information about this talent.'
                      : 'Additional information about this business contact.'}
                  </p>
                  
                  {/* This would be expanded with custom fields */}
                  <div className="rounded-md bg-muted p-4 text-center">
                    <p>No additional information available.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="companies" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Work History</h3>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Building className="h-4 w-4" />
                      <span>Add Employment</span>
                    </Button>
                  </div>
                  
                  {loadingHistory ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : employmentHistory.length > 0 ? (
                    <JobHistoryList history={employmentHistory} />
                  ) : (
                    <div className="rounded-md bg-muted p-4 text-center">
                      <p>No company associations found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {person.type === 'talent' && (
                <TabsContent value="skills" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Skills</h3>
                      <Button size="sm" variant="outline">Add Skill</Button>
                    </div>
                    
                    <div className="rounded-md bg-muted p-4 text-center">
                      <p>No skills have been added yet.</p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PersonDetailView;
