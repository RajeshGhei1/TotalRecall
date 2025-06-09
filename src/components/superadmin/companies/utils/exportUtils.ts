
import { toast } from 'sonner';
import { Company } from '@/hooks/useCompanies';

export const exportCompaniesToCSV = (companies: Company[]) => {
  if (companies.length === 0) {
    toast.error('No companies to export');
    return;
  }

  // Create CSV content
  const headers = ['Name', 'Industry', 'Size', 'Location', 'Founded', 'Website', 'Email'];
  const csvContent = [
    headers.join(','),
    ...companies.map(company => [
      `"${company.name || ''}"`,
      `"${company.industry || ''}"`,
      `"${company.size || ''}"`,
      `"${company.location || ''}"`,
      company.founded || '',
      `"${company.website || ''}"`,
      `"${company.email || ''}"`,
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `companies-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  toast.success(`Exported ${companies.length} companies`);
};
