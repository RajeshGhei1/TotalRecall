
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ProfileTabContent,
  NotificationsTabContent,
  SecurityTabContent,
  PreferencesTabContent,
} from './user-settings';

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

export const UserSettingsDialog = ({ 
  open, 
  onOpenChange, 
  defaultTab = 'profile' 
}: UserSettingsDialogProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  // Listen for custom events to open specific tabs
  useEffect(() => {
    const handleOpenUserSettings = (event: CustomEvent) => {
      if (event.detail?.tab) {
        setActiveTab(event.detail.tab);
      }
      onOpenChange(true);
    };

    window.addEventListener('openUserSettings', handleOpenUserSettings as EventListener);
    
    return () => {
      window.removeEventListener('openUserSettings', handleOpenUserSettings as EventListener);
    };
  }, [onOpenChange]);

  // Reset to default tab when dialog closes
  useEffect(() => {
    if (!open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileTabContent />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsTabContent />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecurityTabContent />
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <PreferencesTabContent />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
