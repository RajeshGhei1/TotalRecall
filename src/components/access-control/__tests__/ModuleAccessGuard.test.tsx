import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import ModuleAccessGuard from '../ModuleAccessGuard';
import { useUnifiedModuleAccess } from '@/hooks/subscriptions/useUnifiedModuleAccess';
import { useAuth } from '@/contexts/AuthContext';
import { ModuleAccessService } from '@/services/moduleAccessService';
import { supabase } from '@/integrations/supabase/client';

// Mock the hooks and services
vi.mock('@/hooks/subscriptions/useUnifiedModuleAccess');
vi.mock('@/contexts/AuthContext');
vi.mock('@/services/moduleAccessService', () => ({
  ModuleAccessService: {
    logModuleAccess: vi.fn(),
  },
}));

// Types for mocked functions
interface MockAuthReturn {
  user: { id: string; email?: string } | null;
  bypassAuth: boolean;
}

interface MockModuleAccessReturn {
  data: {
    hasAccess: boolean;
    accessLevel?: string;
    subscriptionDetails?: {
      planName: string;
      subscriptionType: string;
    };
  } | null;
  isLoading: boolean;
  error?: Error | null;
}

interface MockModuleAccessService {
  logModuleAccess: ReturnType<typeof vi.fn>;
}

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Test component to render inside ModuleAccessGuard
const TestComponent: React.FC = () => (
  <div data-testid="module-content">
    <h1>Module Content</h1>
    <p>This content should only be visible to users with module access</p>
  </div>
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ModuleAccessGuard', () => {
  const mockUseUnifiedModuleAccess = useUnifiedModuleAccess as unknown as Mock<() => MockModuleAccessReturn>;
  const mockUseAuth = useAuth as unknown as Mock<() => MockAuthReturn>;
  const mockModuleAccessService = ModuleAccessService as unknown as MockModuleAccessService;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' },
      bypassAuth: false,
    });

    mockUseUnifiedModuleAccess.mockReturnValue({
      data: { hasAccess: true },
      isLoading: false,
    });

    mockModuleAccessService.logModuleAccess = vi.fn().mockResolvedValue(undefined);

    (supabase.from as unknown).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { tenant_id: 'tenant-123' },
            error: null,
          }),
        }),
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Module Access Control', () => {
    it('should show loading state while checking module access', () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: null,
        isLoading: true,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      expect(document.querySelector('svg.lucide-loader-circle')).toBeInTheDocument();
      expect(screen.queryByTestId('module-content')).not.toBeInTheDocument();
    });

    it('should show module content when user has access', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: true },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByTestId('module-content')).toBeInTheDocument();
        expect(screen.getByText('Module Content')).toBeInTheDocument();
      });
    });

    it('should show subscription required message when user lacks access', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
        expect(screen.getByText(/Access to "test module" requires an active subscription/)).toBeInTheDocument();
        expect(screen.queryByTestId('module-content')).not.toBeInTheDocument();
      });
    });

    it('should show custom fallback when provided and user lacks access', async () => {
      const CustomFallback = () => <div data-testid="custom-fallback">Custom Access Denied</div>;
      
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard 
          moduleName="test_module" 
          fallback={<CustomFallback />}
        >
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
        expect(screen.queryByTestId('module-content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Access Level Requirements', () => {
    it('should handle different required access levels', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: true, accessLevel: 'edit' },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module" requiredAccess="edit">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByTestId('module-content')).toBeInTheDocument();
      });
    });

    it('should deny access when user has insufficient access level', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: true, accessLevel: 'view' },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module" requiredAccess="admin">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
        expect(screen.queryByTestId('module-content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tenant and User Context', () => {
    it('should handle bypass auth mode', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        bypassAuth: true,
      });

      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: true },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByTestId('module-content')).toBeInTheDocument();
      });
    });

    it('should handle missing user gracefully', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        bypassAuth: false,
      });

      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
      });
    });

    it('should handle missing tenant ID gracefully', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123' },
        bypassAuth: false,
      });

      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
      });
    });
  });

  describe('Access Logging', () => {
    it('should log successful access attempts', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: true },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockModuleAccessService.logModuleAccess).toHaveBeenCalledWith(
          expect.any(String), // tenantId
          'user-123',
          'test_module',
          'allowed',
          'subscription'
        );
      });
    });

    it('should log denied access attempts', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockModuleAccessService.logModuleAccess).toHaveBeenCalledWith(
          expect.any(String), // tenantId
          'user-123',
          'test_module',
          'denied',
          'subscription'
        );
      });
    });

    it('should handle logging errors gracefully', async () => {
      mockModuleAccessService.logModuleAccess.mockRejectedValue(new Error('Logging failed'));
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: true },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByTestId('module-content')).toBeInTheDocument();
      });
    });
  });

  describe('Subscription Details Display', () => {
    it('should display current subscription details when available', async () => {
      const subscriptionDetails = {
        planName: 'Professional Plan',
        subscriptionType: 'monthly',
      };

      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { 
          hasAccess: false,
          subscriptionDetails,
        },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Current Plan')).toBeInTheDocument();
        expect(screen.getByText('Professional Plan')).toBeInTheDocument();
        expect(screen.getByText('monthly')).toBeInTheDocument();
      });
    });

    it('should show upgrade button when subscription is required', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Upgrade Subscription')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle module access check errors gracefully', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Access check failed'),
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
      });
    });

    it('should handle undefined access result', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
      });
    });

    it('should handle null access result', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should not re-render unnecessarily when access state is stable', async () => {
      const renderSpy = vi.fn();
      
      const TestComponentWithSpy = () => {
        renderSpy();
        return <div data-testid="module-content">Module Content</div>;
      };

      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: true },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponentWithSpy />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle rapid access state changes', async () => {
      const { rerender } = render(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      // Simulate rapid state changes
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      rerender(
        <ModuleAccessGuard moduleName="test_module">
          <TestComponent />
        </ModuleAccessGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Required')).toBeInTheDocument();
      });
    });
  });

  describe('Module Name Handling', () => {
    it('should handle module names with underscores', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test_module_name">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText(/Access to "test module name" requires an active subscription/)).toBeInTheDocument();
      });
    });

    it('should handle module names with special characters', async () => {
      mockUseUnifiedModuleAccess.mockReturnValue({
        data: { hasAccess: false },
        isLoading: false,
      });

      render(
        <ModuleAccessGuard moduleName="test-module-name">
          <TestComponent />
        </ModuleAccessGuard>,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText(/Access to "test-module-name" requires an active subscription/)).toBeInTheDocument();
      });
    });
  });
}); 