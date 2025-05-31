
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

export const SecurityTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account security and privacy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Change Password</Label>
          <div className="flex gap-2">
            <Input type="password" placeholder="Current password" />
            <Input type="password" placeholder="New password" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Two-Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
          <Button variant="outline">Enable 2FA</Button>
        </div>

        <Button>Update Security</Button>
      </CardContent>
    </Card>
  );
};
