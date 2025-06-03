
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Settings2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalSettingsHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/superadmin/dashboard');
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Global Settings</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Shield className="h-5 w-5 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Super Admin Only</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          variant="outline" 
          onClick={handleBackToDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to BI Dashboard
        </Button>
      </div>
      <p className="text-muted-foreground">
        Configure system-wide settings, security policies, and platform administration
      </p>
    </div>
  );
};

export default GlobalSettingsHeader;
