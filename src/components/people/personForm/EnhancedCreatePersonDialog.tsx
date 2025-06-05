
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePersonForm } from './usePersonForm';
import PersonFormFields from './PersonFormFields';
import { CustomFieldsForm } from '@/components/customFields';
import { FormBehaviorTracker } from '@/components/forms/smart/FormBehaviorTracker';
import { BehavioralTrackingWrapper } from '@/components/ai/BehavioralTrackingWrapper';
import { useSmartFormAssistance } from '@/hooks/ai/useSmartFormAssistance';

interface EnhancedCreatePersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  personType: 'talent' | 'contact';
  userId?: string;
}

export const EnhancedCreatePersonDialog: React.FC<EnhancedCreatePersonDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  personType,
  userId = 'demo-user'
}) => {
  const { form, isSubmitting, error, handleCreatePerson } = usePersonForm({
    personType,
    onSuccess
  });

  const {
    suggestions,
    generateSuggestions,
    applySuggestion,
    dismissSuggestion,
    hasSuggestions
  } = useSmartFormAssistance(`${personType}_form`, userId);

  const formContext = personType === 'talent' ? 'talent_form' : 'contact_form';
  const formId = `create_${personType}_${Date.now()}`;

  const handleFormSubmit = async (values: any) => {
    // Generate suggestions based on current form values before submission
    await generateSuggestions(values, []);
    await handleCreatePerson(values);
  };

  return (
    <BehavioralTrackingWrapper
      module="people"
      action={`create_${personType}`}
      metadata={{ personType, formId }}
      userId={userId}
    >
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New {personType === 'talent' ? 'Talent' : 'Contact'}</DialogTitle>
            <DialogDescription>
              Add a new {personType === 'talent' ? 'talent' : 'business contact'} to the system.
              {personType === 'contact' && " You can optionally associate them with a company."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <FormBehaviorTracker
              form={form}
              formType={`${personType}_creation`}
              formId={formId}
              userId={userId}
            >
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <PersonFormFields form={form} personType={personType} />
                
                {/* AI Suggestions Panel */}
                {hasSuggestions && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-medium mb-2">AI Suggestions</h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-blue-50 rounded-lg text-sm"
                        >
                          <div>
                            <span className="font-medium">{suggestion.fieldName}:</span>{' '}
                            {suggestion.suggestedValue}
                            <div className="text-xs text-gray-600">{suggestion.reasoning}</div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => applySuggestion(suggestion)}
                            >
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => dismissSuggestion(suggestion)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-2">Custom Fields</h3>
                  <CustomFieldsForm
                    entityType={personType}
                    formContext={formContext}
                    form={form}
                  />
                </div>
                
                {error && (
                  <div className="text-sm font-medium text-destructive">
                    {error}
                  </div>
                )}
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create {personType === 'talent' ? 'Talent' : 'Contact'}
                  </Button>
                </DialogFooter>
              </form>
            </FormBehaviorTracker>
          </Form>
        </DialogContent>
      </Dialog>
    </BehavioralTrackingWrapper>
  );
};
