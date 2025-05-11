
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface BasicInfoStepProps {
  tenantData?: {
    tenants?: {
      name?: string;
      description?: string;
    };
  };
}

const BasicInfoStep = ({ tenantData }: BasicInfoStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      <div className="space-y-2">
        <Label htmlFor="wizard-tenant-name">Tenant Name</Label>
        <Input 
          id="wizard-tenant-name"
          defaultValue={tenantData?.tenants?.name || ""}
          placeholder="Enter your organization name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wizard-tenant-description">Description</Label>
        <Textarea 
          id="wizard-tenant-description"
          defaultValue={tenantData?.tenants?.description || ""}
          placeholder="Brief description of your organization"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wizard-logo">Logo</Label>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 border rounded-md flex items-center justify-center bg-gray-50">
            <span className="text-gray-400">No logo</span>
          </div>
          <Button variant="outline">Upload Logo</Button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
