
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyEnhancedListContainer from '@/components/superadmin/companies/CompanyEnhancedListContainer';
import ModuleFeatureIntegration from '@/components/modules/ModuleFeatureIntegration';

const Companies: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("companies");

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <p className="text-muted-foreground">
          Manage your company database and relationships
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Module Features</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Company Database</CardTitle>
              <CardDescription>
                View and manage your company records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyEnhancedListContainer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Available Features</CardTitle>
              <CardDescription>
                Features available in the Companies module based on your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModuleFeatureIntegration 
                moduleName="companies"
                entityType="company"
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Companies;
