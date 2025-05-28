
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExtendedTenantForm, TenantFormValues } from '@/components/superadmin/tenant-form';
import { Tenant } from '@/hooks/useTenants';

interface EditTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormValues) => void;
  isSubmitting: boolean;
  tenant: Tenant | null;
}

const EditTenantDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  tenant,
}: EditTenantDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
          <DialogDescription>
            Update the information for {tenant?.name || 'this tenant'}.
          </DialogDescription>
        </DialogHeader>

        {tenant && (
          <ExtendedTenantForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={onClose}
            initialData={{
              name: tenant.name || '',
              domain: tenant.domain || '',
              companyProfile: tenant.description || '',
              registrationDate: tenant.registration_date ? new Date(tenant.registration_date) : undefined,
              // Initialize other fields with empty values
              cin: '',
              companyStatus: '',
              registeredOfficeAddress: '',
              registeredEmailAddress: '',
              noOfDirectives: '',
              globalRegion: '',
              country: '',
              region: '',
              hoLocation: '',
              industry1: '',
              industry2: '',
              industry3: '',
              companySector: '',
              companyType: '',
              entityType: '',
              noOfEmployee: '',
              segmentAsPerNumberOfEmployees: '',
              turnOver: '',
              segmentAsPerTurnover: '',
              turnoverYear: '',
              yearOfEstablishment: '',
              paidupCapital: '',
              segmentAsPerPaidUpCapital: '',
              areaOfSpecialize: '',
              serviceLine: '',
              verticles: '',
              webSite: '',
              endUserChannel: '',
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTenantDialog;
