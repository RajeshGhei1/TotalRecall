
import React from 'react';
import { Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CurrentCompanyBadgeProps {
  companyName: string;
  role: string;
}

const CurrentCompanyBadge: React.FC<CurrentCompanyBadgeProps> = ({ companyName, role }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
          <Building className="h-3 w-3" />
          <span>{companyName}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{role} at {companyName}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CurrentCompanyBadge;
