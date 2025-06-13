
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TemplateGeneratorProps {
  entityType: 'talent' | 'contact';
}

const TemplateGenerator: React.FC<TemplateGeneratorProps> = ({ entityType }) => {
  const generateCSVTemplate = () => {
    if (entityType === 'contact') {
      const headers = [
        'full_name',
        'email', 
        'phone',
        'location',
        'personal_email',
        'role',
        'company_name',
        'reports_to_name',
        'direct_reports',
        'linkedin_url',
        'current_title',
        'current_company',
        'experience_years',
        'skills',
        'notes',
        'availability_date',
        'desired_salary',
        'resume_url',
        'portfolio_url'
      ];
      
      const sampleData = [
        'John Doe',
        'john.doe@company.com',
        '+1-555-123-4567',
        'New York, NY',
        'john.personal@gmail.com',
        'Senior Manager',
        'Acme Corporation',
        'Jane Smith',
        'Alice Johnson, Bob Wilson',
        'https://linkedin.com/in/johndoe',
        'Senior Software Engineer',
        'Tech Corp',
        '5',
        'JavaScript, React, Node.js',
        'Excellent team player',
        '2024-01-15',
        '85000',
        'https://example.com/resume.pdf',
        'https://portfolio.johndoe.com'
      ];
      
      const csvContent = [
        headers.join(','),
        sampleData.join(',')
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'business_contacts_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };
  
  const handleDownloadTemplate = () => {
    generateCSVTemplate();
    toast.success(`${entityType === 'talent' ? 'Talent' : 'Business Contact'} CSV template has been downloaded to your device.`);
  };

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">
        Supports CSV, XLS, and XLSX files up to 500MB.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center"
        onClick={handleDownloadTemplate}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Template
      </Button>
    </div>
  );
};

export default TemplateGenerator;
