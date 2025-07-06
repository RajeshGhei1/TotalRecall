import React from 'react';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PersonDetailView from '../PersonDetailView';

// Mock the hooks
vi.mock('@/hooks/people/usePersonQuery', () => ({
  usePersonQuery: vi.fn()
}));

vi.mock('@/hooks/company-relationships/usePersonEmploymentHistory', () => ({
  usePersonEmploymentHistory: vi.fn()
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ personId: '1' }),
    useNavigate: () => vi.fn()
  };
});

const mockPerson = {
  id: '1',
  full_name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1234567890',
  location: 'San Francisco',
  type: 'contact' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  current_company: {
    id: '1',
    name: 'Tech Corp',
    role: 'Senior Developer'
  }
};

const mockEmploymentHistory = [
  {
    id: '1',
    company_name: 'Tech Corp',
    role: 'Senior Developer',
    start_date: '2023-01-01',
    end_date: null,
    is_current: true
  }
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/person/:personId" element={children} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PersonDetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders person details successfully', async () => {
    const { usePersonQuery } = await import('@/hooks/people/usePersonQuery');
    const { usePersonEmploymentHistory } = await import('@/hooks/company-relationships/usePersonEmploymentHistory');
    
    (usePersonQuery as any).mockReturnValue({
      data: mockPerson,
      isLoading: false,
      error: null
    });

    (usePersonEmploymentHistory as any).mockReturnValue({
      employmentHistory: mockEmploymentHistory,
      isLoading: false,
      error: null
    });

    render(<PersonDetailView />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    const { usePersonQuery } = await import('@/hooks/people/usePersonQuery');
    const { usePersonEmploymentHistory } = await import('@/hooks/company-relationships/usePersonEmploymentHistory');
    
    (usePersonQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    (usePersonEmploymentHistory as any).mockReturnValue({
      employmentHistory: [],
      isLoading: true,
      error: null
    });

    render(<PersonDetailView />, { wrapper: createWrapper() });

    // Look for loading indicators instead of specific test ID
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const { usePersonQuery } = await import('@/hooks/people/usePersonQuery');
    const { usePersonEmploymentHistory } = await import('@/hooks/company-relationships/usePersonEmploymentHistory');
    
    (usePersonQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load person')
    });

    (usePersonEmploymentHistory as any).mockReturnValue({
      employmentHistory: [],
      isLoading: false,
      error: null
    });

    render(<PersonDetailView />, { wrapper: createWrapper() });

    // Use more flexible text matching
    expect(screen.getByText(/Failed to load person/)).toBeInTheDocument();
  });

  it('shows not found state', async () => {
    const { usePersonQuery } = await import('@/hooks/people/usePersonQuery');
    const { usePersonEmploymentHistory } = await import('@/hooks/company-relationships/usePersonEmploymentHistory');
    
    (usePersonQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    });

    (usePersonEmploymentHistory as any).mockReturnValue({
      employmentHistory: [],
      isLoading: false,
      error: null
    });

    render(<PersonDetailView />, { wrapper: createWrapper() });

    // Use more flexible text matching for split text
    expect(screen.getByText(/Contact.*Not.*Found/)).toBeInTheDocument();
  });
});
