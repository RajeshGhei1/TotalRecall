
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

export const PreferencesTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          App Preferences
        </CardTitle>
        <CardDescription>
          Customize your app experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <p className="text-sm text-muted-foreground">
            Choose your preferred theme
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Light</Button>
            <Button variant="outline" size="sm">Dark</Button>
            <Button variant="outline" size="sm">System</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <p className="text-sm text-muted-foreground">
            Select your preferred language
          </p>
          <Button variant="outline" className="w-32">English</Button>
        </div>

        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  );
};
