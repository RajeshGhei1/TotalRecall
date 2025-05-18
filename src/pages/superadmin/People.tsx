
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
import { Search, UserPlus } from 'lucide-react';
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const People = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [personType, setPersonType] = useState('talent'); // 'talent' or 'contact'

  const handleAddPerson = () => {
    // Logic to add a new person based on the current type
    if (personType === 'talent') {
      // Navigate to add talent form
    } else {
      // Navigate to add contact form
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
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No talents found. Add talents to get started.</p>
                    </div>
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
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No contacts found. Add contacts to get started.</p>
                    </div>
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
        </div>
      </QueryClientProvider>
    </AdminLayout>
  );
};

export default People;
