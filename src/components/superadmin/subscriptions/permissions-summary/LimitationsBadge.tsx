
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LimitationsBadgeProps {
  limitations: string[];
}

const LimitationsBadge: React.FC<LimitationsBadgeProps> = ({ limitations }) => {
  if (limitations.length === 0) return null;

  const displayText = limitations.length > 2 
    ? `${limitations.slice(0, 2).join(', ')}...` 
    : limitations.join(', ');

  return (
    <Badge variant="outline" className="text-xs">
      {displayText}
    </Badge>
  );
};

export default LimitationsBadge;
