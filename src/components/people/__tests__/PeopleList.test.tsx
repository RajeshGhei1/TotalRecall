
import React from 'react';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PeopleList from '../PeopleList';

// Mock the hooks
vi.mock('@/hooks/usePeople', () => ({
  usePeople: vi.fn()
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false)
}));

const mockPeople = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York',
    type: 'contact',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    current_company: {
      id: '1',
      name: 'Test Company',
      role: 'Manager'
    }
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
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PeopleList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders people list successfully', async () => {
    const { usePeople } = await import('@/hooks/usePeople');
    (usePeople as any).mockReturnValue({
      people: mockPeople,
      isLoading: false,
      isError: false,
      error: null,
      deletePerson: { mutate: vi.fn() }
    });

    render(
      <PeopleList
        personType="contact"
        onLinkToCompany={vi.fn()}
        searchQuery=""
        companyFilter="all"
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    const { usePeople } = await import('@/hooks/usePeople');
    (usePeople as any).mockReturnValue({
      people: [],
      isLoading: true,
      isError: false,
      error: null,
      deletePerson: { mutate: vi.fn() }
    });

    render(
      <PeopleList
        personType="contact"
        onLinkToCompany={vi.fn()}
        searchQuery=""
        companyFilter="all"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const { usePeople } = await import('@/hooks/usePeople');
    (usePeople as any).mockReturnValue({
      people: [],
      isLoading: false,
      isError: true,
      error: new Error('Failed to load contacts'),
      deletePerson: { mutate: vi.fn() }
    });

    render(
      <PeopleList
        personType="contact"
        onLinkToCompany={vi.fn()}
        searchQuery=""
        companyFilter="all"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/Error loading contacts/)).toBeInTheDocument();
  });

  it('shows empty state when no people found', async () => {
    const { usePeople } = await import('@/hooks/usePeople');
    (usePeople as any).mockReturnValue({
      people: [],
      isLoading: false,
      isError: false,
      error: null,
      deletePerson: { mutate: vi.fn() }
    });

    render(
      <PeopleList
        personType="contact"
        onLinkToCompany={vi.fn()}
        searchQuery=""
        companyFilter="all"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('No contacts found.')).toBeInTheDocument();
  });
});
