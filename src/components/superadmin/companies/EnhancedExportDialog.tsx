
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
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Company } from '@/hooks/useCompanies';

interface ExportField {
  key: keyof Company;
  label: string;
  selected: boolean;
}

interface EnhancedExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  currentFilters?: string;
}

const EnhancedExportDialog: React.FC<EnhancedExportDialogProps> = ({
  isOpen,
  onClose,
  companies,
  currentFilters
}) => {
  const [exportFields, setExportFields] = useState<ExportField[]>([
    { key: 'name', label: 'Company Name', selected: true },
    { key: 'email', label: 'Email', selected: true },
    { key: 'website', label: 'Website', selected: true },
    { key: 'industry1', label: 'Primary Industry', selected: true },
    { key: 'industry2', label: 'Secondary Industry', selected: false },
    { key: 'industry3', label: 'Tertiary Industry', selected: false },
    { key: 'size', label: 'Company Size', selected: true },
    { key: 'location', label: 'Location', selected: true },
    { key: 'phone', label: 'Phone', selected: false },
    { key: 'description', label: 'Description', selected: false },
    { key: 'founded', label: 'Founded Year', selected: false },
    { key: 'linkedin', label: 'LinkedIn', selected: false },
    { key: 'twitter', label: 'Twitter', selected: false },
    { key: 'facebook', label: 'Facebook', selected: false },
    { key: 'cin', label: 'CIN', selected: false },
    { key: 'companyStatus', label: 'Company Status', selected: false },
  ]);
  
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const handleFieldToggle = (fieldKey: keyof Company) => {
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

  const selectRequiredFields = () => {
    setExportFields(prev =>
      prev.map(field => ({
        ...field,
        selected: ['name', 'email', 'website', 'industry1', 'location'].includes(field.key as string)
      }))
    );
  };

  const generateCSV = () => {
    const selectedFields = exportFields.filter(field => field.selected);
    const headers = selectedFields.map(field => field.label);
    
    const csvContent = [
      ...(includeHeaders ? [headers.join(',')] : []),
      ...companies.map(company =>
        selectedFields.map(field => {
          const value = company[field.key];
          if (value === null || value === undefined) return '';
          
          // Escape commas and quotes in CSV
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
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
      a.download = `companies-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Exported ${companies.length} companies as ${exportFormat.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to export companies');
      console.error('Export error:', error);
    }
  };

  const selectedCount = exportFields.filter(field => field.selected).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Companies</DialogTitle>
          <DialogDescription>
            Customize your company export with field selection and format options
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

          {/* Export Format */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="flex space-x-4">
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'xlsx') => setExportFormat(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                </SelectContent>
              </Select>
              
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
            </div>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Select Fields to Export</Label>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={selectRequiredFields}>
                  Required Only
                </Button>
                <Button variant="outline" size="sm" onClick={selectAllFields}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={selectNoneFields}>
                  Select None
                </Button>
              </div>
            </div>

            <ScrollArea className="h-64 border rounded-md p-4">
              <div className="grid grid-cols-2 gap-3">
                {exportFields.map((field) => (
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
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedCount === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export {companies.length} Companies
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedExportDialog;
