
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanySelectorProps {
  companyId: string;
  companies: { id: string; name: string }[];
  onCompanyChange: (value: string) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  companyId,
  companies,
  onCompanyChange
}) => {
  console.log('CompanySelector rendering with:', { companyId, companiesCount: companies.length, companies });
  
  return (
    <div className="space-y-2">
      <Label htmlFor="company_select">Company</Label>
      <Select
        value={companyId}
        onValueChange={(value) => {
          console.log('Company selector onChange triggered with value:', value);
          onCompanyChange(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;
