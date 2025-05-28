
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface WizardStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: "Basic Info", description: "Tenant details" },
    { number: 2, title: "Modules", description: "Select & configure" },
    { number: 3, title: "Integrations", description: "External connections" },
    { number: 4, title: "Configuration", description: "Custom settings" },
    { number: 5, title: "Outreach", description: "Communication tools" },
    { number: 6, title: "Review", description: "Finalize setup" }
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center min-w-0 flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                step.number < currentStep 
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {step.number < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div className="text-center mt-2">
                <div className={`text-sm font-medium ${
                  step.number <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WizardStepIndicator;
