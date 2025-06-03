
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Key } from 'lucide-react';
import { PasswordChangeForm } from './PasswordChangeForm';

export const SecurityTabContent = () => {
  return (
    <div className="space-y-6">
      <PasswordChangeForm />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication is not yet available. This feature will be coming soon.
          </p>
          <Button variant="outline" disabled>
            Enable 2FA (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Monitor and manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recent Activity</Label>
            <p className="text-sm text-muted-foreground">
              Your account activity is monitored for suspicious behavior. 
              Session timeout is managed according to your organization's security policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
