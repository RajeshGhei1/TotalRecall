
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CompanyCompletenessResult, getCompletenessBadgeVariant, getCompletenessColor } from '@/utils/companyCompletenessCalculator';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface CompletenessScoreProps {
  completeness: CompanyCompletenessResult;
  showProgress?: boolean;
  showTooltip?: boolean;
}

const CompletenessScore: React.FC<CompletenessScoreProps> = ({
  completeness,
  showProgress = false,
  showTooltip = true,
}) => {
  const { score, missingFields, completedFields } = completeness;
  const colorClass = getCompletenessColor(score);
  const badgeVariant = getCompletenessBadgeVariant(score);

  const ScoreDisplay = () => (
    <div className="flex items-center gap-2">
      <Badge variant={badgeVariant} className="font-medium">
        {score}%
      </Badge>
      {score < 70 && <AlertTriangle className="h-3 w-3 text-amber-500" />}
      {score >= 90 && <CheckCircle className="h-3 w-3 text-green-500" />}
      {showProgress && (
        <div className="w-16">
          <Progress value={score} className="h-1" />
        </div>
      )}
    </div>
  );

  if (!showTooltip) {
    return <ScoreDisplay />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <ScoreDisplay />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <div className="font-medium">Data Completeness: {score}%</div>
            <div className="text-sm">
              <div className="text-green-600 mb-1">
                ✓ Completed ({completedFields.length}): {completedFields.join(', ')}
              </div>
              {missingFields.length > 0 && (
                <div className="text-red-600">
                  ✗ Missing ({missingFields.length}): {missingFields.join(', ')}
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompletenessScore;
