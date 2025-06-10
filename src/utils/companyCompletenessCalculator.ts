
import { Company } from '@/hooks/useCompanies';

export interface CompanyCompletenessResult {
  score: number;
  missingFields: string[];
  completedFields: string[];
  totalFields: number;
}

const KEY_FIELDS = [
  { field: 'email', label: 'Email' },
  { field: 'phone', label: 'Phone' },
  { field: 'website', label: 'Website' },
  { field: 'description', label: 'Description' },
  { field: 'industry', label: 'Industry' },
  { field: 'size', label: 'Company Size' },
  { field: 'location', label: 'Location' },
  { field: 'linkedin', label: 'LinkedIn' },
  { field: 'founded', label: 'Founded Year' },
  { field: 'country', label: 'Country' },
];

export const calculateCompanyCompleteness = (company: Company): CompanyCompletenessResult => {
  const completedFields: string[] = [];
  const missingFields: string[] = [];

  KEY_FIELDS.forEach(({ field, label }) => {
    const value = company[field as keyof Company];
    if (value && value !== '') {
      completedFields.push(label);
    } else {
      missingFields.push(label);
    }
  });

  const score = Math.round((completedFields.length / KEY_FIELDS.length) * 100);

  return {
    score,
    missingFields,
    completedFields,
    totalFields: KEY_FIELDS.length,
  };
};

export const getCompletenessColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getCompletenessBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
};
