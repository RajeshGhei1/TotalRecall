
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export const ProfileTabContent = () => {
  const { user, bypassAuth } = useAuth();

  const getUserInitials = () => {
    if (bypassAuth) return 'DU';
    
    const fullName = user?.user_metadata?.full_name || user?.email || '';
    const nameParts = fullName.split(' ');
    
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return fullName.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (bypassAuth) return 'Development User';
    return user?.user_metadata?.full_name || 'User';
  };

  const getDisplayEmail = () => {
    if (bypassAuth) return 'dev@jobmojo.ai';
    return user?.email || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your profile information and avatar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-lg font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              defaultValue={getDisplayName().split(' ')[0] || ''} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              defaultValue={getDisplayName().split(' ').slice(1).join(' ') || ''} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            defaultValue={getDisplayEmail()} 
            disabled 
          />
          <p className="text-xs text-muted-foreground">
            Contact support to change your email address.
          </p>
        </div>

        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
};
