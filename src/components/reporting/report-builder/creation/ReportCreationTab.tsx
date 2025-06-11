
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecureRunDynamicReport, useSecureSaveReport } from '@/hooks/useSecureReportingService';
import { SavedReport, Filter } from '@/services/reportingService';
import { Plus, X, Play, Save } from 'lucide-react';

interface ReportCreationTabProps {
  savedReports: SavedReport[];
  onSaveReport: (report: SavedReport) => void;
}

const ReportCreationTab: React.FC<ReportCreationTabProps> = ({ savedReports, onSaveReport }) => {
  const [reportName, setReportName] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [groupBy, setGroupBy] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const runReportMutation = useSecureRunDynamicReport();
  const saveReportMutation = useSecureSaveReport();

  const entityOptions = [
    { value: 'companies', label: 'Companies' },
    { value: 'people', label: 'People' },
    { value: 'talents', label: 'Talents' },
    { value: 'tenants', label: 'Tenants' },
    { value: 'dropdown_options', label: 'Dropdown Options' }
  ];

  const columnOptions: Record<string, string[]> = {
    companies: ['name', 'industry', 'size', 'location', 'email', 'website', 'created_at'],
    people: ['full_name', 'email', 'phone', 'location', 'type', 'created_at'],
    talents: ['first_name', 'last_name', 'email', 'skills', 'experience_years', 'location'],
    tenants: ['name', 'plan_type', 'status', 'created_at', 'settings'],
    dropdown_options: ['label', 'value', 'category_id', 'sort_order', 'is_default']
  };

  const addFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  const updateFilter = (index: number, field: keyof Filter, value: string) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setFilters(updatedFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const runReport = async () => {
    if (!selectedEntity || selectedColumns.length === 0) {
      return;
    }

    try {
      const result = await runReportMutation.mutateAsync({
        entity: selectedEntity,
        columns: selectedColumns,
        filters: filters.filter(f => f.field && f.value),
        groupBy: groupBy || undefined
      });
      setResults(result);
    } catch (error) {
      console.error('Failed to run report:', error);
    }
  };

  const saveReport = async () => {
    if (!reportName || !selectedEntity || selectedColumns.length === 0) {
      return;
    }

    try {
      const savedReport = await saveReportMutation.mutateAsync({
        name: reportName,
        entity: selectedEntity,
        columns: selectedColumns,
        filters: filters.filter(f => f.field && f.value),
        group_by: groupBy || '',
        aggregation: [],
        visualization_type: 'table'
      });
      onSaveReport(savedReport);
      
      // Reset form
      setReportName('');
      setSelectedEntity('');
      setSelectedColumns([]);
      setFilters([]);
      setGroupBy('');
      setResults([]);
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="entity">Data Source</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {entityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Column Selection */}
          {selectedEntity && (
            <div>
              <Label>Columns to Include</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {columnOptions[selectedEntity]?.map(column => (
                  <Badge
                    key={column}
                    variant={selectedColumns.includes(column) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleColumnToggle(column)}
                  >
                    {column}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Filters</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFilter}>
                <Plus className="h-4 w-4 mr-1" />
                Add Filter
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select 
                    value={filter.field} 
                    onValueChange={(value) => updateFilter(index, 'field', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedEntity && columnOptions[selectedEntity]?.map(column => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filter.operator} 
                    onValueChange={(value) => updateFilter(index, 'operator', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFilter(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Group By */}
          {selectedEntity && (
            <div>
              <Label htmlFor="group-by">Group By (Optional)</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grouping column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Grouping</SelectItem>
                  {columnOptions[selectedEntity]?.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={runReport}
              disabled={!selectedEntity || selectedColumns.length === 0 || runReportMutation.isPending}
            >
              <Play className="h-4 w-4 mr-2" />
              {runReportMutation.isPending ? 'Running...' : 'Run Report'}
            </Button>
            
            <Button
              variant="outline"
              onClick={saveReport}
              disabled={!reportName || !selectedEntity || selectedColumns.length === 0 || saveReportMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveReportMutation.isPending ? 'Saving...' : 'Save Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {selectedColumns.map(column => (
                      <th key={column} className="border border-gray-300 px-4 py-2 text-left">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {selectedColumns.map(column => (
                        <td key={column} className="border border-gray-300 px-4 py-2">
                          {typeof row[column] === 'object' ? JSON.stringify(row[column]) : String(row[column] || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {results.length} results
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportCreationTab;
