
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { Company } from '@/hooks/useCompanies';

interface AnalyticsExportField {
  key: string;
  label: string;
  selected: boolean;
  type: 'data' | 'computed';
}

interface AnalyticsExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  currentFilters?: string;
}

const AnalyticsExportDialog: React.FC<AnalyticsExportDialogProps> = ({
  isOpen,
  onClose,
  companies,
  currentFilters
}) => {
  const [exportFields, setExportFields] = useState<AnalyticsExportField[]>([
    // Basic company data
    { key: 'name', label: 'Company Name', selected: true, type: 'data' },
    { key: 'email', label: 'Email', selected: true, type: 'data' },
    { key: 'website', label: 'Website', selected: true, type: 'data' },
    { key: 'industry1', label: 'Primary Industry', selected: true, type: 'data' },
    { key: 'industry2', label: 'Secondary Industry', selected: false, type: 'data' },
    { key: 'industry3', label: 'Tertiary Industry', selected: false, type: 'data' },
    { key: 'size', label: 'Company Size', selected: true, type: 'data' },
    { key: 'location', label: 'Location', selected: true, type: 'data' },
    { key: 'founded', label: 'Founded Year', selected: false, type: 'data' },
    { key: 'companysector', label: 'Company Sector', selected: false, type: 'data' },
    { key: 'companytype', label: 'Company Type', selected: false, type: 'data' },
    
    // Computed analytics fields
    { key: 'data_completeness_score', label: 'Data Completeness Score', selected: true, type: 'computed' },
    { key: 'industry_category', label: 'Industry Category', selected: false, type: 'computed' },
    { key: 'company_age', label: 'Company Age (Years)', selected: false, type: 'computed' },
    { key: 'has_social_presence', label: 'Has Social Media Presence', selected: false, type: 'computed' },
    { key: 'profile_completeness', label: 'Profile Completeness %', selected: true, type: 'computed' },
  ]);
  
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);

  const handleFieldToggle = (fieldKey: string) => {
    setExportFields(prev =>
      prev.map(field =>
        field.key === fieldKey
          ? { ...field, selected: !field.selected }
          : field
      )
    );
  };

  const selectAllFields = () => {
    setExportFields(prev => prev.map(field => ({ ...field, selected: true })));
  };

  const selectNoneFields = () => {
    setExportFields(prev => prev.map(field => ({ ...field, selected: false })));
  };

  const selectDataFields = () => {
    setExportFields(prev =>
      prev.map(field => ({
        ...field,
        selected: field.type === 'data'
      }))
    );
  };

  const selectComputedFields = () => {
    setExportFields(prev =>
      prev.map(field => ({
        ...field,
        selected: field.type === 'computed'
      }))
    );
  };

  // Calculate computed analytics values
  const calculateComputedValues = (company: Company) => {
    const currentYear = new Date().getFullYear();
    const foundedYear = company.founded || currentYear;
    
    // Data completeness score (0-100)
    const requiredFields = ['name', 'email', 'website', 'industry1', 'location'];
    const optionalFields = ['phone', 'description', 'linkedin', 'twitter', 'facebook'];
    const allFields = [...requiredFields, ...optionalFields];
    
    const filledFields = allFields.filter(field => {
      const value = company[field as keyof Company];
      return value && value.toString().trim().length > 0;
    });
    
    const dataCompletenessScore = Math.round((filledFields.length / allFields.length) * 100);
    
    // Industry category (simplified grouping)
    const industryCategory = company.industry1 ? 
      (company.industry1.toLowerCase().includes('tech') ? 'Technology' :
       company.industry1.toLowerCase().includes('finance') ? 'Finance' :
       company.industry1.toLowerCase().includes('health') ? 'Healthcare' :
       'Other') : 'Unknown';
    
    // Company age
    const companyAge = currentYear - foundedYear;
    
    // Social media presence
    const hasSocialPresence = !!(company.linkedin || company.twitter || company.facebook);
    
    // Profile completeness (weighted score)
    const weightedScore = 
      (company.name ? 20 : 0) +
      (company.email ? 15 : 0) +
      (company.website ? 15 : 0) +
      (company.industry1 ? 15 : 0) +
      (company.location ? 10 : 0) +
      (company.description ? 10 : 0) +
      (company.phone ? 5 : 0) +
      (hasSocialPresence ? 10 : 0);
    
    return {
      data_completeness_score: dataCompletenessScore,
      industry_category: industryCategory,
      company_age: companyAge,
      has_social_presence: hasSocialPresence ? 'Yes' : 'No',
      profile_completeness: weightedScore,
    };
  };

  const generateCSV = () => {
    const selectedFields = exportFields.filter(field => field.selected);
    const headers = selectedFields.map(field => field.label);
    
    const csvRows = [];
    
    // Add metadata if requested
    if (includeMetadata) {
      csvRows.push(`"Export Date","${new Date().toISOString()}"`);
      csvRows.push(`"Total Companies","${companies.length}"`);
      csvRows.push(`"Applied Filters","${currentFilters || 'None'}"`);
      csvRows.push(''); // Empty row separator
    }
    
    // Add headers
    if (includeHeaders) {
      csvRows.push(headers.join(','));
    }
    
    // Add data rows
    companies.forEach(company => {
      const computedValues = calculateComputedValues(company);
      
      const row = selectedFields.map(field => {
        let value: any;
        
        if (field.type === 'computed') {
          value = computedValues[field.key as keyof typeof computedValues];
        } else {
          value = company[field.key as keyof Company];
        }
        
        if (value === null || value === undefined) return '';
        
        // Escape commas and quotes in CSV
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const generateXLSX = () => {
    // For now, we'll generate CSV format even for XLSX
    // In a real implementation, you'd use a library like xlsx
    toast.info('XLSX export will be implemented using CSV format for now');
    return generateCSV();
  };

  const handleExport = () => {
    const selectedFields = exportFields.filter(field => field.selected);
    
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field to export');
      return;
    }

    try {
      const content = exportFormat === 'csv' ? generateCSV() : generateXLSX();
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `companies-analytics-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Exported analytics for ${companies.length} companies as ${exportFormat.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to export analytics');
      console.error('Export error:', error);
    }
  };

  const selectedCount = exportFields.filter(field => field.selected).length;
  const dataFields = exportFields.filter(field => field.type === 'data');
  const computedFields = exportFields.filter(field => field.type === 'computed');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BarChart className="mr-2 h-5 w-5" />
            Export Analytics Data
          </DialogTitle>
          <DialogDescription>
            Export company data with computed analytics and insights
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Export Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Companies to export:</span>
                <span className="font-semibold">{companies.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Selected fields:</span>
                <span className="font-semibold">{selectedCount}</span>
              </div>
              {currentFilters && (
                <div className="text-xs text-muted-foreground">
                  Current filters: {currentFilters}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'xlsx') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-headers"
                    checked={includeHeaders}
                    onCheckedChange={(checked) => setIncludeHeaders(checked === true)}
                  />
                  <Label htmlFor="include-headers" className="text-sm">
                    Include headers
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-metadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
                  />
                  <Label htmlFor="include-metadata" className="text-sm">
                    Include export metadata
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Select Fields to Export</Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={selectDataFields}>
                  Data Only
                </Button>
                <Button variant="outline" size="sm" onClick={selectComputedFields}>
                  Analytics Only
                </Button>
                <Button variant="outline" size="sm" onClick={selectAllFields}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={selectNoneFields}>
                  Select None
                </Button>
              </div>
            </div>

            <ScrollArea className="h-80 border rounded-md p-4">
              <div className="space-y-4">
                {/* Data Fields */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-blue-600">Company Data Fields</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {dataFields.map((field) => (
                      <div key={field.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.key}
                          checked={field.selected}
                          onCheckedChange={(checked) => handleFieldToggle(field.key)}
                        />
                        <Label htmlFor={field.key} className="text-sm font-normal">
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Computed Fields */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-green-600">Computed Analytics Fields</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {computedFields.map((field) => (
                      <div key={field.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.key}
                          checked={field.selected}
                          onCheckedChange={(checked) => handleFieldToggle(field.key)}
                        />
                        <Label htmlFor={field.key} className="text-sm font-normal">
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedCount === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Analytics ({companies.length} companies)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsExportDialog;
