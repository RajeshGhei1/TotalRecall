import React from 'react';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ContactAnalyticsDashboard from '../analytics/ContactAnalyticsDashboard';

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: unknown) => <div data-testid="chart-container">{children}</div>,
  BarChart: ({ children }: unknown) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }: unknown) => <div data-testid="pie-chart">{children}</div>,
  LineChart: ({ children }: unknown) => <div data-testid="line-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          count: 'exact',
          head: true,
          gte: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({ data: [], length: 0 }))
            }))
          }))
        }))
      }))
    }))
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ContactAnalyticsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders analytics dashboard with key metrics', async () => {
    render(<ContactAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Total Contacts')).toBeInTheDocument();
      expect(screen.getByText('With Companies')).toBeInTheDocument();
      expect(screen.getByText('Added This Month')).toBeInTheDocument();
      expect(screen.getByText('Coverage Rate')).toBeInTheDocument();
    });
  });

  it('renders chart components', async () => {
    render(<ContactAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Check for at least 2 chart containers (adjust based on actual component)
      const chartContainers = screen.getAllByTestId('chart-container');
      expect(chartContainers.length).toBeGreaterThanOrEqual(2);
      
      // Check for specific chart types
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  it('renders tab navigation', async () => {
    render(<ContactAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Company Distribution')).toBeInTheDocument();
      expect(screen.getByText('Growth Trends')).toBeInTheDocument();
      expect(screen.getByText('Engagement')).toBeInTheDocument();
    });
  });
});
