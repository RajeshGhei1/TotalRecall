import React, { lazy, ComponentType, Suspense } from 'react';

// Utility for creating lazy-loaded components with proper error boundaries
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback ? React.createElement(fallback) : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Predefined lazy loaders for common heavy components
export const lazyLoadCharts = () => import('recharts');
export const lazyLoadPDF = () => import('jspdf');
export const lazyLoadPDFAutoTable = () => import('jspdf-autotable');
export const lazyLoadFileProcessing = () => import('papaparse');
export const lazyLoadExcel = () => import('xlsx');
export const lazyLoadReactFlow = () => import('reactflow');
export const lazyLoadMarkdown = () => import('react-markdown');

// Lazy load specific chart components
export const lazyLoadBarChart = () => import('recharts').then(m => ({ BarChart: m.BarChart, Bar: m.Bar }));
export const lazyLoadLineChart = () => import('recharts').then(m => ({ LineChart: m.LineChart, Line: m.Line }));
export const lazyLoadPieChart = () => import('recharts').then(m => ({ PieChart: m.PieChart, Pie: m.Pie }));

// Lazy load utility components
export const lazyLoadChartWidget = () => import('@/components/dashboard/widgets/ChartWidget');
export const lazyLoadDocumentExport = () => import('@/utils/documentExport');