
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

export const NotificationsTabContent = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to be notified about updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications in your browser
            </p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive weekly summary emails
            </p>
          </div>
          <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
        </div>

        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  );
};
