
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CompanyLinkFormContent from './CompanyLinkFormContent';
import { useCompanyLinkForm } from './hooks/useCompanyLinkForm';

interface CompanyLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  companies: { id: string; name: string }[];
  personType?: 'talent' | 'contact';
  personId?: string;
  isSubmitting: boolean;
}

const CompanyLinkForm: React.FC<CompanyLinkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  companies,
  personType,
  personId,
  isSubmitting: externalIsSubmitting
}) => {
  const {
    formData,
    startDate,
    endDate,
    potentialManagers,
    isSubmitting,
    handleSubmit,
    handleCompanyChange,
    handleRoleChange,
    handleStartDateChange,
    handleEndDateChange,
    handleManagerChange
  } = useCompanyLinkForm({
    personId,
    personType,
    onSubmit,
    onClose,
    isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Person to Company</DialogTitle>
          <DialogDescription>
            Create a new company relationship for this person.
          </DialogDescription>
        </DialogHeader>
        <CompanyLinkFormContent
          formData={formData}
          startDate={startDate}
          endDate={endDate}
          companies={companies}
          potentialManagers={potentialManagers}
          isSubmitting={isSubmitting || externalIsSubmitting}
          handleCompanyChange={handleCompanyChange}
          handleRoleChange={handleRoleChange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          handleManagerChange={handleManagerChange}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
