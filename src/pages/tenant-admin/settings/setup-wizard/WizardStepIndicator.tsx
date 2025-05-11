
import React from "react";
import { CheckCircle } from "lucide-react";

interface WizardStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const WizardStepIndicator = ({ currentStep, totalSteps }: WizardStepIndicatorProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 === currentStep 
                  ? "bg-jobmojo-primary text-white"
                  : index + 1 < currentStep
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {index + 1 < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs mt-1">
              {index === 0 ? "Basics" : 
               index === 1 ? "Social" : 
               index === 2 ? "Communication" : "Outreach"}
            </span>
          </div>
          {index < totalSteps - 1 && (
            <div className={`h-1 flex-1 mx-2 ${
              index + 1 < currentStep ? "bg-green-400" : "bg-gray-200"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WizardStepIndicator;
