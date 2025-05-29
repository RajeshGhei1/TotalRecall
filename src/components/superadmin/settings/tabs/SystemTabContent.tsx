
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Database, Shield, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SystemTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Platform Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Platform Configuration
          </CardTitle>
          <CardDescription>
            Global platform settings that affect all tenants and users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">System Maintenance Mode</h4>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Enable maintenance mode to prevent user access during updates
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Global Rate Limiting</h4>
                <Badge variant="outline">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Configure API rate limits across all tenants
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Platform-wide security configurations and policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Password Policy</h4>
                <Badge variant="outline">Standard</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Global password requirements for all users
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Session Management</h4>
                <Badge variant="outline">24h Timeout</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Configure session timeouts and multi-device policies
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance & Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance & Monitoring
          </CardTitle>
          <CardDescription>
            System performance settings and monitoring configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">System Monitoring</h4>
                <Badge variant="default">Enabled</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Monitor system health, performance metrics, and alerts
              </p>
              <Button variant="outline" size="sm">View Dashboard</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Backup Configuration</h4>
                <Badge variant="default">Daily</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Automated backups and data retention policies
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Notifications
          </CardTitle>
          <CardDescription>
            Platform-wide notification settings and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">System Announcements</h4>
                <Badge variant="outline">None Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Create system-wide announcements for all users
              </p>
              <Button variant="outline" size="sm">Create Announcement</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Email Templates</h4>
                <Badge variant="outline">12 Templates</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Manage global email templates for system notifications
              </p>
              <Button variant="outline" size="sm">Manage Templates</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTabContent;
