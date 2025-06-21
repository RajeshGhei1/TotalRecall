
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useModulePromotion, getNextStage, getPromotionRequirements } from '@/hooks/useModulePromotion';

interface ModulePromotionButtonProps {
  moduleId: string;
  currentStage: string;
  progress: number;
  onPromotionSuccess?: () => void;
}

const ModulePromotionButton: React.FC<ModulePromotionButtonProps> = ({
  moduleId,
  currentStage,
  progress,
  onPromotionSuccess
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { promoteModule, isPromoting } = useModulePromotion();
  
  const nextStage = getNextStage(currentStage);
  const requirements = getPromotionRequirements(currentStage);
  
  // Don't show button if already in production
  if (!nextStage || currentStage === 'production') {
    return null;
  }

  // Check if module meets minimum requirements for promotion
  const meetsRequirements = progress >= getMinProgressForPromotion(currentStage);

  const handlePromotion = async () => {
    try {
      await promoteModule({
        moduleId,
        currentStage,
        targetStage: nextStage,
        progressData: {
          code_completion: Math.min(progress + 10, 100),
          test_coverage: Math.min(progress + 5, 100),
          feature_completion: Math.min(progress + 15, 100),
          documentation_completion: Math.min(progress + 8, 100),
        }
      });
      
      setDialogOpen(false);
      
      // Call the success callback to refresh the UI
      if (onPromotionSuccess) {
        onPromotionSuccess();
      }
    } catch (error) {
      console.error('Promotion failed:', error);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={meetsRequirements ? "default" : "outline"}
          size="sm"
          className={`flex items-center gap-2 ${
            meetsRequirements 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
          }`}
          disabled={!meetsRequirements}
        >
          {meetsRequirements ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          Promote to {nextStage}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Promote Module to {nextStage}</DialogTitle>
          <DialogDescription>
            Are you ready to promote <strong>{moduleId}</strong> from {currentStage} to {nextStage}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Progress */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Progress</span>
              <Badge variant="secondary">{progress}%</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Promotion Requirements:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {!meetsRequirements && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Minimum {getMinProgressForPromotion(currentStage)}% progress required
                </span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handlePromotion}
            disabled={!meetsRequirements || isPromoting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPromoting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Promoting...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Promote to {nextStage}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get minimum progress required for promotion
const getMinProgressForPromotion = (stage: string): number => {
  const requirements = {
    'planning': 25,  // 25% to go to alpha
    'alpha': 60,     // 60% to go to beta  
    'beta': 85,      // 85% to go to production
  };
  return requirements[stage as keyof typeof requirements] || 0;
};

export default ModulePromotionButton;
