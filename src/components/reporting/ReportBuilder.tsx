import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Save, PlusCircle, Trash2, BarChart2, PieChart } from "lucide-react";
import { useCustomFieldsList } from '@/hooks/customFields';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchSavedReports, saveReport, Filter, Aggregation, SavedReport } from '@/services/reportingService';

const availableEntities = [
  { label: 'Talents', value: 'talents' },
  { label: 'Business Contacts', value: 'people' },
  { label: 'Companies', value: 'companies' }
];

const aggregationFunctions = [
  { label: 'Count', value: 'count' },
  { label: 'Sum', value: 'sum' },
  { label: 'Average', value: 'avg' },
  { label: 'Maximum', value: 'max' },
  { label: 'Minimum', value: 'min' }
];

const visualizationTypes = [
  { label: 'Table', value: 'table' },
  { label: 'Bar Chart', value: 'bar', icon: BarChart2 },
  { label: 'Pie Chart', value: 'pie', icon: PieChart },
  { label: 'Line Chart', value: 'line' }
];

const defaultColumns = {
  talents: ['id', 'full_name', 'email', 'phone', 'location', 'years_of_experience', 'current_salary'],
  people: ['id', 'full_name', 'email', 'phone', 'type', 'location'],
  companies: ['id', 'name', 'industry', 'location', 'size']
};

const ReportBuilder = () => {
  const [reportName, setReportName] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [groupBy, setGroupBy] = useState<string>('');
  const [aggregation, setAggregation] = useState<Aggregation[]>([]);
  const [visualizationType, setVisualizationType] = useState<string>('table');
  const [reportResults, setReportResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Get custom fields for the selected entity
  const { customFields = [] } = useCustomFieldsList(selectedEntity || undefined);

  // Fetch saved reports
  const { data: savedReports = [], refetch: refetchSavedReports } = useQuery({
    queryKey: ['saved-reports'],
    queryFn: fetchSavedReports,
    enabled: true,
  });

  // Update available columns when entity changes
  React.useEffect(() => {
    if (selectedEntity) {
      const standardColumns = defaultColumns[selectedEntity as keyof typeof defaultColumns] || [];
      // Combine with custom fields
      const customFieldColumns = customFields
        .filter(field => field.applicable_forms?.includes(selectedEntity))
        .map(field => `custom_${field.field_key}`);
      
      setAvailableColumns([...standardColumns, ...customFieldColumns]);
      setSelectedColumns([]);
      setFilters([]);
      setGroupBy('');
      setAggregation([]);
    }
  }, [selectedEntity, customFields]);

  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const addFilter = () => {
    if (availableColumns.length > 0) {
      setFilters([...filters, { field: availableColumns[0], operator: 'equals', value: '' }]);
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const addAggregation = () => {
    if (availableColumns.length > 0) {
      setAggregation([...aggregation, { function: 'count', field: availableColumns[0] }]);
    }
  };

  const removeAggregation = (index: number) => {
    const newAggregations = [...aggregation];
    newAggregations.splice(index, 1);
    setAggregation(newAggregations);
  };

  const runReport = async () => {
    if (!selectedEntity || selectedColumns.length === 0) {
      toast.error('Please select an entity and at least one column');
      return;
    }

    setIsRunning(true);

    try {
      // Build the query
      let query = supabase.from(selectedEntity).select(selectedColumns.join(','));

      // Apply filters
      filters.forEach(filter => {
        if (filter.field && filter.value) {
          switch (filter.operator) {
            case 'equals':
              query = query.eq(filter.field, filter.value);
              break;
            case 'contains':
              query = query.ilike(filter.field, `%${filter.value}%`);
              break;
            case 'greater_than':
              query = query.gt(filter.field, filter.value);
              break;
            case 'less_than':
              query = query.lt(filter.field, filter.value);
              break;
            default:
              break;
          }
        }
      });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Process aggregations if needed
      let processedData = data || [];
      if (groupBy && aggregation.length > 0 && data) {
        // Simple client-side aggregation
        const grouped = data.reduce((acc: Record<string, any[]>, item: any) => {
          const key = item[groupBy]?.toString() || 'Unknown';
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {});

        // Apply aggregations
        processedData = Object.entries(grouped).map(([key, values]: [string, any[]]) => {
          const result: Record<string, any> = { [groupBy]: key };
          aggregation.forEach(agg => {
            const field = agg.field;
            const func = agg.function;
            const numbers = (values).map(v => Number(v[field])).filter(n => !isNaN(n));
            
            switch (func) {
              case 'count':
                result[`${func}_${field}`] = values.length;
                break;
              case 'sum':
                result[`${func}_${field}`] = numbers.reduce((sum, n) => sum + n, 0);
                break;
              case 'avg':
                result[`${func}_${field}`] = numbers.length ? 
                  numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
                break;
              case 'max':
                result[`${func}_${field}`] = numbers.length ? Math.max(...numbers) : 0;
                break;
              case 'min':
                result[`${func}_${field}`] = numbers.length ? Math.min(...numbers) : 0;
                break;
              default:
                break;
            }
          });
          return result;
        });
      }

      setReportResults(processedData);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error running report:', error);
      toast.error('Failed to run report');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveReport = async () => {
    if (!reportName) {
      toast.error('Please enter a report name');
      return;
    }

    if (!selectedEntity || selectedColumns.length === 0) {
      toast.error('Please select an entity and at least one column');
      return;
    }

    try {
      const reportConfig = {
        name: reportName,
        entity: selectedEntity,
        columns: selectedColumns,
        filters,
        group_by: groupBy,
        aggregation,
        visualization_type: visualizationType
      };

      await saveReport(reportConfig);
      toast.success('Report saved successfully');
      
      // Refresh saved reports
      refetchSavedReports();
      
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Failed to save report');
    }
  };

  const loadReport = (report: SavedReport) => {
    setReportName(report.name);
    setSelectedEntity(report.entity);
    setSelectedColumns(report.columns);
    setFilters(report.filters);
    setGroupBy(report.group_by);
    setAggregation(report.aggregation);
    setVisualizationType(report.visualization_type);
    toast.success(`Loaded report: ${report.name}`);
  };

  const downloadCsv = () => {
    if (reportResults.length === 0) {
      toast.error('No data to download');
      return;
    }

    try {
      // Convert data to CSV
      const headers = Object.keys(reportResults[0]).join(',');
      const rows = reportResults.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${rows}`;
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `${reportName || 'report'}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>
            Create custom reports by selecting entities, columns, and applying filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="report-name">Report Name</Label>
                <Input 
                  id="report-name" 
                  value={reportName} 
                  onChange={(e) => setReportName(e.target.value)} 
                  placeholder="Enter a name for your report"
                />
              </div>
              <div>
                <Label>Entity</Label>
                <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Entities</SelectLabel>
                      {availableEntities.map((entity) => (
                        <SelectItem key={entity.value} value={entity.value}>
                          {entity.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedEntity && (
              <>
                <div>
                  <Label>Columns</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2">
                    {availableColumns.map((column) => (
                      <div key={column} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`column-${column}`} 
                          checked={selectedColumns.includes(column)}
                          onCheckedChange={() => handleColumnToggle(column)}
                        />
                        <label
                          htmlFor={`column-${column}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {column}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Filters</Label>
                    <Button variant="outline" size="sm" onClick={addFilter}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Filter
                    </Button>
                  </div>
                  {filters.length > 0 ? (
                    <div className="space-y-2">
                      {filters.map((filter, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Select 
                            value={filter.field}
                            onValueChange={(value) => {
                              const newFilters = [...filters];
                              newFilters[index].field = value;
                              setFilters(newFilters);
                            }}
                          >
                            <SelectTrigger className="w-[30%]">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableColumns.map(column => (
                                <SelectItem key={column} value={column}>
                                  {column}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select
                            value={filter.operator}
                            onValueChange={(value) => {
                              const newFilters = [...filters];
                              newFilters[index].operator = value;
                              setFilters(newFilters);
                            }}
                          >
                            <SelectTrigger className="w-[30%]">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="greater_than">Greater than</SelectItem>
                              <SelectItem value="less_than">Less than</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Input
                            className="w-[30%]"
                            value={filter.value}
                            onChange={(e) => {
                              const newFilters = [...filters];
                              newFilters[index].value = e.target.value;
                              setFilters(newFilters);
                            }}
                            placeholder="Value"
                          />
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFilter(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No filters added. Add a filter to narrow down your report data.</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="group-by">Group By</Label>
                    <Select value={groupBy} onValueChange={setGroupBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a column to group by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {availableColumns.map(column => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Visualization</Label>
                    <Select value={visualizationType} onValueChange={setVisualizationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visualization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {visualizationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              {type.icon && <type.icon className="mr-2 h-4 w-4" />}
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {groupBy && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Aggregations</Label>
                      <Button variant="outline" size="sm" onClick={addAggregation}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Aggregation
                      </Button>
                    </div>
                    
                    {aggregation.length > 0 ? (
                      <div className="space-y-2">
                        {aggregation.map((agg, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Select
                              value={agg.function}
                              onValueChange={(value) => {
                                const newAggs = [...aggregation];
                                newAggs[index].function = value;
                                setAggregation(newAggs);
                              }}
                            >
                              <SelectTrigger className="w-[45%]">
                                <SelectValue placeholder="Select function" />
                              </SelectTrigger>
                              <SelectContent>
                                {aggregationFunctions.map(func => (
                                  <SelectItem key={func.value} value={func.value}>
                                    {func.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select
                              value={agg.field}
                              onValueChange={(value) => {
                                const newAggs = [...aggregation];
                                newAggs[index].field = value;
                                setAggregation(newAggs);
                              }}
                            >
                              <SelectTrigger className="w-[45%]">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableColumns.map(column => (
                                  <SelectItem key={column} value={column}>
                                    {column}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAggregation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No aggregations added. Add aggregations to summarize your grouped data.</p>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <div className="space-x-2">
                    <Button onClick={runReport} disabled={isRunning}>
                      {isRunning ? 'Running...' : 'Run Report'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSaveReport}
                      disabled={!reportName || isRunning}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Report
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={downloadCsv}
                    disabled={reportResults.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {reportResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
            <CardDescription>
              {reportResults.length} records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(reportResults[0]).map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportResults.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.entries(row).map(([column, value], cellIndex) => (
                        <TableCell key={cellIndex}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {savedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.entity}</TableCell>
                      <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => loadReport(report)}>
                          Load
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportBuilder;
