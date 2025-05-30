
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableWidgetProps {
  data: any[];
  config: {
    title: string;
    columns?: string[];
    page_size?: number;
  };
}

const TableWidget: React.FC<TableWidgetProps> = ({ data, config }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    );
  }

  const columns = config.columns || Object.keys(data[0] || {});
  const pageSize = config.page_size || 10;
  const displayData = data.slice(0, pageSize);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>
                {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column}>
                  {row[column]?.toString() || '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {data.length > pageSize && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {pageSize} of {data.length} rows
        </div>
      )}
    </div>
  );
};

export default TableWidget;
