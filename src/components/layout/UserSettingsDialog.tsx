
import React from 'react';
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
}

export const UserSettingsDialog = ({ open, onOpenChange }: UserSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
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
