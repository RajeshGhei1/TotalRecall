
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table, BarChart } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { toast } from 'sonner';

interface AnalyticsExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const AnalyticsExportDialog: React.FC<AnalyticsExportDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { companies = [] } = useCompanies();
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json' | 'pdf'>('csv');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['basic_info']);
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions: ExportOption[] = [
    {
      id: 'basic_info',
      label: 'Basic Company Information',
      description: 'Name, industry, location, size, etc.',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'growth_data',
      label: 'Growth Analytics',
      description: 'Registration dates, growth trends',
      icon: <BarChart className="h-4 w-4" />
    },
    {
      id: 'geographic_data',
      label: 'Geographic Distribution',
      description: 'Country, region, city breakdown',
      icon: <Table className="h-4 w-4" />
    },
    {
      id: 'industry_data',
      label: 'Industry Analysis',
      description: 'Sector classifications, industry breakdown',
      icon: <BarChart className="h-4 w-4" />
    },
    {
      id: 'hierarchy_data',
      label: 'Hierarchy Information',
      description: 'Parent-child relationships, groups',
      icon: <Table className="h-4 w-4" />
    },
    {
      id: 'completeness_data',
      label: 'Data Completeness Report',
      description: 'Field completion statistics',
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleExport = async () => {
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one export option');
      return;
    }

    setIsExporting(true);

    try {
      // Prepare export data based on selected options
      const exportData: any = {};

      if (selectedOptions.includes('basic_info')) {
        exportData.basic_info = companies.map(company => ({
          name: company.name,
          industry: company.industry,
          location: company.location,
          size: company.size,
          website: company.website,
          email: company.email,
          phone: company.phone,
          created_at: company.created_at
        }));
      }

      if (selectedOptions.includes('growth_data')) {
        exportData.growth_data = companies.map(company => ({
          name: company.name,
          created_at: company.created_at,
          registration_year: new Date(company.created_at).getFullYear(),
          registration_month: new Date(company.created_at).getMonth() + 1
        }));
      }

      if (selectedOptions.includes('geographic_data')) {
        exportData.geographic_data = companies.map(company => ({
          name: company.name,
          country: company.country,
          region: company.region,
          location: company.location
        }));
      }

      if (selectedOptions.includes('industry_data')) {
        exportData.industry_data = companies.map(company => ({
          name: company.name,
          industry: company.industry,
          industry1: company.industry1,
          industry2: company.industry2,
          industry3: company.industry3,
          company_sector: company.companySector,
          company_type: company.companyType
        }));
      }

      if (selectedOptions.includes('hierarchy_data')) {
        exportData.hierarchy_data = companies.map(company => ({
          name: company.name,
          parent_company_id: company.parent_company_id,
          hierarchy_level: company.hierarchy_level,
          company_group_name: company.company_group_name
        }));
      }

      if (selectedOptions.includes('completeness_data')) {
        const fieldsToCheck = ['email', 'phone', 'website', 'description', 'industry', 'size', 'location'];
        exportData.completeness_data = companies.map(company => {
          const completeness: any = { name: company.name };
          fieldsToCheck.forEach(field => {
            completeness[`${field}_filled`] = !!(company as any)[field];
          });
          return completeness;
        });
      }

      // Generate and download file based on format
      const filename = `company_analytics_${new Date().toISOString().split('T')[0]}`;

      if (exportFormat === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadFile(blob, `${filename}.json`);
      } else if (exportFormat === 'csv') {
        // For CSV, we'll export the first selected dataset
        const firstDataset = Object.values(exportData)[0] as any[];
        if (firstDataset && firstDataset.length > 0) {
          const csvContent = convertToCSV(firstDataset);
          const blob = new Blob([csvContent], { type: 'text/csv' });
          downloadFile(blob, `${filename}.csv`);
        }
      } else {
        toast.error(`${exportFormat.toUpperCase()} export not yet implemented`);
        return;
      }

      toast.success(`Analytics data exported successfully as ${exportFormat.toUpperCase()}`);
      onClose();
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics data');
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Analytics Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export format selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export options */}
          <div className="space-y-3">
            <Label>Data to Export</Label>
            <div className="space-y-3">
              {exportOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <Label htmlFor={option.id} className="font-medium">
                        {option.label}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="text-sm text-muted-foreground border-t pt-4">
            Will export data for {companies.length} companies in {exportFormat.toUpperCase()} format.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || selectedOptions.length === 0}
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsExportDialog;
