
import React from 'react';
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

const Talents = () => {
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
              <BreadcrumbPage>Talents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Talent Management</h1>
          <p className="text-muted-foreground">Manage talent profiles across the JobMojo platform.</p>
        </div>

        <div className="flex justify-between mb-6">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search talents..." 
              className="pl-8" 
            />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Talent
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Talents</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="new">New Applications</TabsTrigger>
          </TabsList>
          
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
      </div>
    </AdminLayout>
  );
};

export default Talents;
