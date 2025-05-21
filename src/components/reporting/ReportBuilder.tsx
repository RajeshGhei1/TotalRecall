
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Filter, Aggregation, SavedReport, fetchSavedReports, saveReport, deleteReport, runDynamicReport } from '@/services/reportingService';
import { useCustomFieldsList } from '@/hooks/customFields/useCustomFieldsList';

type EntityOption = {
  value: string;
  label: string;
};

interface FieldOption {
  value: string;
  label: string;
}

const ReportBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [entity, setEntity] = useState<string>('companies');
  const [columns, setColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [newFilter, setNewFilter] = useState<Filter>({ field: '', operator: 'equals', value: '' });
  const [groupBy, setGroupBy] = useState<string>('');
  const [aggregation, setAggregation] = useState<Aggregation[]>([]);
  const [reportName, setReportName] = useState<string>('');
  const [visualizationType, setVisualizationType] = useState<string>('table');
  const [reportResults, setReportResults] = useState<any[]>([]);
  const [availableFields, setAvailableFields] = useState<FieldOption[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  
  // Get custom fields for the selected entity
  const { customFields } = useCustomFieldsList({ entityType: entity });

  // Entity options for the dropdown
  const entityOptions: EntityOption[] = [
    { value: 'companies', label: 'Companies' },
    { value: 'people', label: 'People' },
    { value: 'talents', label: 'Talents' },
    { value: 'dropdown_options', label: 'Dropdown Options' },
  ];

  // Operator options for filters
  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
  ];

  // Aggregation function options
  const aggregationFunctions = [
    { value: 'count', label: 'Count' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
  ];

  // Visualization options
  const visualizationOptions = [
    { value: 'table', label: 'Table' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'line', label: 'Line Chart' },
  ];

  // Load saved reports
  useEffect(() => {
    const loadSavedReports = async () => {
      try {
        const reports = await fetchSavedReports();
        setSavedReports(reports);
      } catch (error) {
        console.error('Error loading saved reports:', error);
        toast({
          title: 'Error loading reports',
          description: 'Failed to load saved reports. Please try again.',
          variant: 'destructive',
        });
      }
    };

    loadSavedReports();
  }, [toast]);

  // Update available fields when entity changes
  useEffect(() => {
    const getFields = async () => {
      try {
        // For demo purposes, we'll use a hardcoded list of fields for each entity
        // In a real app, this would come from schema metadata or custom fields
        let fields: FieldOption[] = [];

        // Common fields
        fields.push({ value: 'id', label: 'ID' });
        fields.push({ value: 'created_at', label: 'Created At' });
        fields.push({ value: 'updated_at', label: 'Updated At' });

        // Entity-specific fields
        if (entity === 'companies') {
          fields = [
            ...fields,
            { value: 'name', label: 'Name' },
            { value: 'website', label: 'Website' },
            { value: 'industry', label: 'Industry' },
            { value: 'size', label: 'Size' },
          ];
        } else if (entity === 'people') {
          fields = [
            ...fields,
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'position', label: 'Position' },
          ];
        } else if (entity === 'talents') {
          fields = [
            ...fields,
            { value: 'name', label: 'Name' },
            { value: 'skills', label: 'Skills' },
            { value: 'experience', label: 'Experience' },
            { value: 'education', label: 'Education' },
          ];
        }

        // Add custom fields if available
        if (customFields?.length > 0) {
          customFields.forEach(field => {
            fields.push({
              value: field.field_key,
              label: field.name,
            });
          });
        }

        setAvailableFields(fields);
        
        // Reset selected columns and filters when entity changes
        setColumns([]);
        setFilters([]);
        setGroupBy('');
        setAggregation([]);
        
      } catch (error) {
        console.error('Error loading fields:', error);
      }
    };

    getFields();
  }, [entity, customFields]);

  // Handle column selection
  const handleColumnChange = (field: string, isChecked: boolean) => {
    if (isChecked) {
      setColumns([...columns, field]);
    } else {
      setColumns(columns.filter(col => col !== field));
    }
  };

  // Add a new filter
  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator) {
      setFilters([...filters, { ...newFilter }]);
      setNewFilter({ field: '', operator: 'equals', value: '' });
    }
  };

  // Remove a filter
  const handleRemoveFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  // Run the report
  const handleRunReport = async () => {
    if (!entity || columns.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select an entity and at least one column.',
        variant: 'destructive',
      });
      return;
    }

    setIsRunning(true);
    try {
      const results = await runDynamicReport(entity, columns, filters, groupBy);
      setReportResults(results);
      toast({
        title: 'Report Generated',
        description: `Successfully generated report with ${results.length} records.`,
      });
    } catch (error) {
      console.error('Error running report:', error);
      toast({
        title: 'Error Running Report',
        description: 'Failed to run the report. Please check your inputs and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Save the report
  const handleSaveReport = async () => {
    if (!reportName) {
      toast({
        title: 'Missing Report Name',
        description: 'Please enter a name for your report.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const newReport = await saveReport({
        name: reportName,
        entity,
        columns,
        filters,
        group_by: groupBy,
        aggregation,
        visualization_type: visualizationType,
      });
      
      setSavedReports([newReport, ...savedReports]);
      setSaveDialogOpen(false);
      
      toast({
        title: 'Report Saved',
        description: 'Your report has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: 'Error Saving Report',
        description: 'Failed to save the report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Load a saved report
  const handleLoadReport = (report: SavedReport) => {
    setEntity(report.entity);
    setColumns(report.columns);
    setFilters(report.filters);
    setGroupBy(report.group_by);
    setAggregation(report.aggregation);
    setVisualizationType(report.visualization_type);
    setReportName(report.name);
    setActiveTab('create');
  };

  // Delete a saved report
  const handleDeleteReport = async (id: string) => {
    try {
      await deleteReport(id);
      setSavedReports(savedReports.filter(report => report.id !== id));
      toast({
        title: 'Report Deleted',
        description: 'The report has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error Deleting Report',
        description: 'Failed to delete the report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="create">Create Report</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            {/* Report Builder Form */}
            <div className="space-y-4">
              {/* Entity Selection */}
              <div>
                <Label htmlFor="entity-select">Select Entity</Label>
                <Select value={entity} onValueChange={setEntity}>
                  <SelectTrigger id="entity-select" className="w-full">
                    <SelectValue placeholder="Select an entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Column Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">Select Columns</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableFields.map((field) => (
                    <div key={field.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${field.value}`}
                        checked={columns.includes(field.value)}
                        onCheckedChange={(checked) => handleColumnChange(field.value, !!checked)}
                      />
                      <Label htmlFor={`column-${field.value}`} className="text-sm">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filters */}
              <div>
                <h3 className="text-sm font-medium mb-2">Filters</h3>
                
                {/* Add Filter */}
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <Select 
                    value={newFilter.field} 
                    onValueChange={(value) => setNewFilter({...newFilter, field: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={newFilter.operator}
                    onValueChange={(value) => setNewFilter({...newFilter, operator: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorOptions.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Value"
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
                  />
                  
                  <Button onClick={handleAddFilter}>Add Filter</Button>
                </div>
                
                {/* Filter List */}
                {filters.length > 0 && (
                  <div className="bg-muted/50 p-2 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Applied Filters:</h4>
                    <ul className="space-y-1">
                      {filters.map((filter, index) => {
                        const fieldLabel = availableFields.find(f => f.value === filter.field)?.label || filter.field;
                        const operatorLabel = operatorOptions.find(o => o.value === filter.operator)?.label || filter.operator;
                        
                        return (
                          <li key={index} className="flex items-center justify-between text-sm p-1 border-b">
                            <span>
                              {fieldLabel} {operatorLabel} "{filter.value}"
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveFilter(index)}
                            >
                              Remove
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Group By */}
              <div>
                <Label htmlFor="group-by">Group By (Optional)</Label>
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger id="group-by">
                    <SelectValue placeholder="Select field (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {availableFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Visualization Type */}
              <div>
                <Label htmlFor="visualization-type">Visualization Type</Label>
                <Select value={visualizationType} onValueChange={setVisualizationType}>
                  <SelectTrigger id="visualization-type">
                    <SelectValue placeholder="Select visualization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visualizationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Save Report</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Report</DialogTitle>
                      <DialogDescription>
                        Give your report a name to save it for future use.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input
                        id="report-name"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="Enter report name"
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveReport}
                        disabled={isSaving || !reportName.trim()}
                      >
                        {isSaving ? 'Saving...' : 'Save Report'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={handleRunReport} 
                  disabled={isRunning || columns.length === 0}
                >
                  {isRunning ? 'Running...' : 'Run Report'}
                </Button>
              </div>
            </div>
            
            {/* Report Results */}
            {reportResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Report Results</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((col) => (
                          <TableHead key={col}>
                            {availableFields.find(f => f.value === col)?.label || col}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportResults.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {columns.map((col) => (
                            <TableCell key={col}>
                              {String(row[col] || '')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      {reportResults.length} records found
                    </TableCaption>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Saved Reports</h3>
              
              {savedReports.length === 0 ? (
                <div className="text-center p-6 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">No saved reports yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Your First Report
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedReports.map((report) => (
                    <Card key={report.id} className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            Entity: {entityOptions.find(e => e.value === report.entity)?.label || report.entity}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {new Date(report.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLoadReport(report)}
                          >
                            Load
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportBuilder;
