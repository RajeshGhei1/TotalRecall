import { Filter, Aggregation, SavedReport } from '@/services/reportingService';
import { FieldOption } from './hooks/useReportFields';

export interface EntityOption {
  value: string;
  label: string;
}

export interface ReportCreationState {
  entity: string;
  columns: string[];
  filters: Filter[];
  groupBy: string;
  aggregation: Aggregation[];
  reportName: string;
  visualizationType: string;
}

export interface ReportFormProps {
  reportState: ReportCreationState;
  setReportState: React.Dispatch<React.SetStateAction<ReportCreationState>>;
  availableFields: FieldOption[];
  entityOptions: EntityOption[];
  operatorOptions: { value: string; label: string }[];
  visualizationOptions: { value: string; label: string }[];
}

export interface ReportResultsProps {
  reportResults: unknown[];
  columns: string[];
  availableFields: FieldOption[];
  visualizationType?: string;
}

export interface SavedReportsTabProps {
  savedReports: SavedReport[];
  setSavedReports: React.Dispatch<React.SetStateAction<SavedReport[]>>;
  onLoadReport: (report: SavedReport) => void;
}

export interface ReportCreationTabProps {
  savedReports: SavedReport[];
  onSaveReport: (report: SavedReport) => void;
}

export interface FiltersInputProps {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  availableFields: FieldOption[];
  operatorOptions: { value: string; label: string }[];
}

export interface ColumnSelectorProps {
  columns: string[];
  availableFields: FieldOption[];
  onColumnChange: (field: string, isChecked: boolean) => void;
}
