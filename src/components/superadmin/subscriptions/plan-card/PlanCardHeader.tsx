
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Building, User, Settings, Edit, MoreHorizontal, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface PlanCardHeaderProps {
  plan: {
    id: string;
    name: string;
    plan_type: string;
    is_active: boolean;
    version?: string;
  };
  isSelected: boolean;
  onEditClick: () => void;
}

const PlanCardHeader: React.FC<PlanCardHeaderProps> = ({ plan, isSelected, onEditClick }) => {
  const getIcon = (planType: string) => {
    switch (planType) {
      case 'recruitment':
        return <Building className="h-5 w-5" />;
      case 'employer':
        return <Crown className="h-5 w-5" />;
      case 'talent':
        return <User className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <div className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 ${
          isSelected 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
        }`}>
          {getIcon(plan.plan_type)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-xl text-gray-900 mb-3 text-left leading-tight">
            {plan.name}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge 
              variant="outline" 
              className="text-sm px-3 py-1 capitalize bg-white border-gray-300 text-gray-700 font-medium"
            >
              {plan.plan_type}
            </Badge>
            <Badge 
              variant={plan.is_active ? 'default' : 'secondary'} 
              className={`text-sm px-3 py-1 font-medium ${
                plan.is_active 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}
            >
              {plan.is_active ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Active
                </>
              ) : (
                'Inactive'
              )}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={onEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PlanCardHeader;
