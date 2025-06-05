
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRealTimeBehaviorTracking } from '@/hooks/ai/useRealTimeBehaviorTracking';
import { useTenantContext } from '@/contexts/TenantContext';

interface FormBehaviorTrackerProps {
  form: UseFormReturn<any>;
  formType: string;
  formId: string;
  userId?: string;
  children: React.ReactNode;
}

export const FormBehaviorTracker: React.FC<FormBehaviorTrackerProps> = ({
  form,
  formType,
  formId,
  userId = 'demo-user',
  children
}) => {
  const { selectedTenantId } = useTenantContext();
  const { trackFormInteraction, trackError, trackWorkflowStep } = useRealTimeBehaviorTracking(userId);

  useEffect(() => {
    // Track form start
    trackFormInteraction(formId, 'form_start', 'initiated');

    const subscription = form.watch((data, { name, type }) => {
      if (name && type) {
        // Track field interactions
        trackFormInteraction(formId, name, type);
      }
    });

    // Track form validation errors
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(fieldName => {
        trackError(`Form validation error in ${fieldName}`, {
          formType,
          formId,
          fieldName,
          error: errors[fieldName]?.message
        });
      });
    }

    return () => {
      subscription.unsubscribe();
      // Track form abandonment if not submitted
      if (!form.formState.isSubmitted) {
        trackWorkflowStep(formType, 'form_abandoned', 'incomplete');
      }
    };
  }, [form, formType, formId, trackFormInteraction, trackError, trackWorkflowStep]);

  // Track successful form submission
  useEffect(() => {
    if (form.formState.isSubmitted && form.formState.isSubmitSuccessful) {
      trackWorkflowStep(formType, 'form_completed', 'success');
    }
  }, [form.formState.isSubmitted, form.formState.isSubmitSuccessful, formType, trackWorkflowStep]);

  return <>{children}</>;
};
