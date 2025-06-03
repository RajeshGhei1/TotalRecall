
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { TabsContent } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import GlobalSettingsHeader from '@/components/superadmin/global-settings/GlobalSettingsHeader';
import GlobalSettingsTabs from '@/components/superadmin/global-settings/GlobalSettingsTabs';
import GeneralTab from '@/components/superadmin/global-settings/tabs/GeneralTab';
import SecurityTab from '@/components/superadmin/global-settings/tabs/SecurityTab';
import PerformanceTab from '@/components/superadmin/global-settings/tabs/PerformanceTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const GlobalSettings = () => {
  console.log("Rendering SuperAdmin Global Settings Page");
  
  return (
    <ErrorBoundary>
      <AdminLayout>
        <div className="p-6">
          <GlobalSettingsHeader />
          
          <ErrorBoundary>
            <GlobalSettingsTabs>
              <TabsContent value="general" className="mt-6">
                <GeneralTab />
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <SecurityTab />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-6">
                <PerformanceTab />
              </TabsContent>
              
              <TabsContent value="maintenance" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Construction className="h-5 w-5" />
                      Maintenance Management
                    </CardTitle>
                    <CardDescription>
                      Schedule maintenance windows and monitor system health
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Maintenance management features coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Construction className="h-5 w-5" />
                      System Notifications
                    </CardTitle>
                    <CardDescription>
                      Manage system-wide notifications and alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      System notifications management coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="email" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Construction className="h-5 w-5" />
                      Email Templates
                    </CardTitle>
                    <CardDescription>
                      Manage global email templates and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Email template management coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="system" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Construction className="h-5 w-5" />
                      System Information
                    </CardTitle>
                    <CardDescription>
                      View system information and health metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      System information dashboard coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Construction className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Global user settings and default configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Global user management coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </GlobalSettingsTabs>
          </ErrorBoundary>
        </div>
      </AdminLayout>
    </ErrorBoundary>
  );
};

export default GlobalSettings;
