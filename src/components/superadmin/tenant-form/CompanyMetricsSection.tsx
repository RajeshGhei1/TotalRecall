
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect } from './FormFields';
import { TenantFormValues, formOptions } from './schema';

interface CompanyMetricsSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const CompanyMetricsSection: React.FC<CompanyMetricsSectionProps> = ({ form }) => {
  const { segmentOptions } = formOptions;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput 
        form={form}
        name="noOfEmployee"
        label="No. of Employee"
        type="number"
        required
      />
      
      <FormSelect 
        form={form}
        name="segmentAsPerNumberOfEmployees"
        label="Segment as per Number of Employees"
        options={segmentOptions}
        required
      />
      
      <FormInput 
        form={form}
        name="turnOver"
        label="Turn Over"
        type="number"
        required
      />
      
      <FormSelect 
        form={form}
        name="segmentAsPerTurnover"
        label="Segment as per Turnover"
        options={segmentOptions}
        required
      />
      
      <FormInput 
        form={form}
        name="turnoverYear"
        label="Turnover Year"
        type="number"
        required
      />
      
      <FormInput 
        form={form}
        name="yearOfEstablishment"
        label="Year of Establishment"
        type="number"
        required
      />
      
      <FormInput 
        form={form}
        name="paidupCapital"
        label="Paidup Capital"
        type="number"
        required
      />
      
      <FormSelect 
        form={form}
        name="segmentAsPerPaidUpCapital"
        label="Segment as per Paid up Capital"
        options={segmentOptions}
        required
      />
    </div>
  );
};

export default CompanyMetricsSection;
