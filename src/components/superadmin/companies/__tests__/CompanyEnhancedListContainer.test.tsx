import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CompanyEnhancedListContainer from '../CompanyEnhancedListContainer';

vi.mock('@/components/superadmin/companies/CompanyAllocationDialog', () => ({
  default: () => null,
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <div data-testid="separator" />,
}));

vi.mock('@/hooks/useSuperAdminCheck', () => ({
  useSuperAdminCheck: vi.fn(),
}));

vi.mock('@/hooks/useCompanies', async () => {
  const actual = await vi.importActual<typeof import('@/hooks/useCompanies')>('@/hooks/useCompanies');
  return {
    ...actual,
    useCompanies: vi.fn(),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const companiesFixture = [
  {
    id: 'tenant-1',
    name: 'TenantCo',
    owner_type: 'tenant',
    website: 'https://tenant.example.com',
    industry1: 'Software',
    location: 'NYC',
    size: '51-200',
    company_group_name: 'Tenant Group',
    hierarchy_level: 1,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'platform-1',
    name: 'PlatformCo',
    owner_type: 'platform',
    website: 'https://platform.example.com',
    industry1: 'AI',
    location: 'SF',
    size: '201-500',
    company_group_name: 'Platform Group',
    hierarchy_level: 0,
    created_at: '2024-01-02T00:00:00Z',
  },
];

describe('CompanyEnhancedListContainer', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useSuperAdminCheck } = await import('@/hooks/useSuperAdminCheck');
    (useSuperAdminCheck as unknown as vi.Mock).mockReturnValue({
      isSuperAdmin: false,
    });

    const { useCompanies } = await import('@/hooks/useCompanies');
    (useCompanies as unknown as vi.Mock).mockImplementation(() => ({
      companies: companiesFixture,
      isLoading: false,
      updateCompany: { mutate: vi.fn(), isPending: false },
      deleteCompany: { mutateAsync: vi.fn(), isPending: false },
    }));
  });

  it('renders ownership badges for tenant and platform records', async () => {
    render(<CompanyEnhancedListContainer />, { wrapper: createWrapper() });

    expect(await screen.findByText('TenantCo')).toBeInTheDocument();
    expect(screen.getByText('Tenant')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it('hides edit/delete for non-tenant records when not super admin', async () => {
    render(<CompanyEnhancedListContainer />, { wrapper: createWrapper() });

    const platformRow = screen.getByText('PlatformCo').closest('tr');
    expect(platformRow).not.toBeNull();

    const platformCheckbox = within(platformRow as HTMLElement).getByRole('checkbox', {
      name: 'Select PlatformCo',
    });
    expect(platformCheckbox).toBeDisabled();

    expect(within(platformRow as HTMLElement).queryByText('Edit Company')).not.toBeInTheDocument();
    expect(within(platformRow as HTMLElement).queryByText('Delete Company')).not.toBeInTheDocument();

    const tenantRow = screen.getByText('TenantCo').closest('tr');
    expect(tenantRow).not.toBeNull();
    expect(within(tenantRow as HTMLElement).getByText('Edit Company')).toBeInTheDocument();
    expect(within(tenantRow as HTMLElement).getByText('Delete Company')).toBeInTheDocument();
  });
});

