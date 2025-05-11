
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect, FormInput } from './FormFields';
import { TenantFormValues, formOptions } from './schema';

interface CompanyMetricsSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const CompanyMetricsSection: React.FC<CompanyMetricsSectionProps> = ({ form }) => {
  const { segmentOptions, employeeRangeOptions, turnoverRangeOptions, yearOptions } = formOptions;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="noOfEmployee"
        label="No Of Employee"
        required
      />
      
      <FormSelect
        form={form}
        name="segmentAsPerNumberOfEmployees"
        label="Segment As Per Number Of Employees"
        options={employeeRangeOptions}
        required
      />
      
      <FormInput
        form={form}
        name="turnOver"
        label="Turn Over"
        required
      />
      
      <FormSelect
        form={form}
        name="segmentAsPerTurnover"
        label="Segment As Per Turnover"
        options={turnoverRangeOptions}
        required
      />
      
      <FormSelect
        form={form}
        name="turnoverYear"
        label="Turnover Year"
        options={yearOptions}
        required
      />
      
      <FormSelect
        form={form}
        name="yearOfEstablishment"
        label="Year Of Establishment"
        options={yearOptions}
        required
      />
      
      <FormInput
        form={form}
        name="paidupCapital"
        label="Paidup Capital"
        required
      />
      
      <FormSelect
        form={form}
        name="segmentAsPerPaidUpCapital"
        label="Segment As Per Paid Up Capital"
        options={segmentOptions}
        required
      />
    </div>
  );
};

export default CompanyMetricsSection;
