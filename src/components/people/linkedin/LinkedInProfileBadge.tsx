
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';
import { LinkedInProfile } from '@/services/linkedinService';

interface LinkedInProfileBadgeProps {
  profile: LinkedInProfile;
  variant?: 'compact' | 'detailed';
  showViewButton?: boolean;
}

export const LinkedInProfileBadge: React.FC<LinkedInProfileBadgeProps> = ({
  profile,
  variant = 'compact',
  showViewButton = true
}) => {
  const openLinkedInProfile = () => {
    if (profile.publicProfileUrl) {
      window.open(profile.publicProfileUrl, '_blank');
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">in</span>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          LinkedIn Connected
        </Badge>
        {showViewButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={openLinkedInProfile}
            className="h-6 px-2"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <Avatar className="w-12 h-12">
        <AvatarImage src={profile.profilePictureUrl} />
        <AvatarFallback className="bg-blue-600 text-white">
          {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">in</span>
          </div>
          <span className="font-medium text-sm">{profile.firstName} {profile.lastName}</span>
        </div>
        
        {profile.headline && (
          <p className="text-xs text-gray-600 mb-1 truncate">{profile.headline}</p>
        )}
        
        <div className="flex items-center gap-2">
          {profile.industry && (
            <Badge variant="outline" className="text-xs">{profile.industry}</Badge>
          )}
          {profile.location && (
            <span className="text-xs text-gray-500">{profile.location}</span>
          )}
        </div>
      </div>
      
      {showViewButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={openLinkedInProfile}
          className="shrink-0"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View
        </Button>
      )}
    </div>
  );
};

export default LinkedInProfileBadge;
