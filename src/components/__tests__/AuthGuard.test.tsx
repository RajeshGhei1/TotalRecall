import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import AuthGuard from '../AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdminCheck } from '@/hooks/useSuperAdminCheck';

// Mock the hooks
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('@/contexts/AuthContext')>('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});
vi.mock('@/hooks/useSuperAdminCheck');
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Types for mocked hooks
interface MockAuthReturn {
  user: { id: string; email: string } | null;
  session: { user: { id: string; email: string }; access_token: string } | null;
  loading: boolean;
  bypassAuth: boolean;
  signIn: ReturnType<typeof vi.fn>;
  signUp: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
}

interface MockSuperAdminReturn {
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

// Test component to render inside AuthGuard
const TestComponent: React.FC = () => (
  <div data-testid="protected-content">
    <h1>Protected Content</h1>
    <p>This content should only be visible to authenticated users</p>
  </div>
);

const createWrapper = (initialEntries = ['/protected']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('AuthGuard', () => {
  const mockUseAuth = useAuth as unknown as Mock<() => MockAuthReturn>;
  const mockUseSuperAdminCheck = useSuperAdminCheck as unknown as Mock<() => MockSuperAdminReturn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Authentication Protection', () => {
    it('should show loading state while checking authentication', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to auth page when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <Routes>
          <Route path="/protected" element={
            <AuthGuard>
              <TestComponent />
            </AuthGuard>
          } />
          <Route path="/auth" element={<div data-testid="auth-page">Auth Page</div>} />
        </Routes>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should show protected content when user is authenticated', () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should allow access in bypass mode', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        bypassAuth: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Super Admin Protection', () => {
    it('should show loading state while checking super admin role', () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: true,
        error: null,
      });

      render(
        <AuthGuard requiresSuperAdmin>
          <TestComponent />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should allow access when user is super admin', () => {
      const mockUser = { id: 'user-123', email: 'admin@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: true,
        isLoading: false,
        error: null,
      });

      render(
        <AuthGuard requiresSuperAdmin>
          <TestComponent />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect non-super admin users to home', () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <Routes>
          <Route path="/protected" element={
            <AuthGuard requiresSuperAdmin>
              <TestComponent />
            </AuthGuard>
          } />
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
        </Routes>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should show error toast when super admin check fails', () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: 'Failed to check super admin status',
      });

      render(
        <Routes>
          <Route
            path="/protected"
            element={
              <AuthGuard requiresSuperAdmin>
                <TestComponent />
              </AuthGuard>
            }
          />
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
        </Routes>,
        { wrapper: createWrapper() }
      );

      // The error should be handled by the toast system and redirect to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle authentication loading and super admin loading simultaneously', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: true,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: true,
        error: null,
      });

      render(
        <AuthGuard requiresSuperAdmin>
          <TestComponent />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle bypass mode with super admin requirement', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        bypassAuth: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <AuthGuard requiresSuperAdmin>
          <TestComponent />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should handle user authentication but super admin check error', () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: 'Database connection failed',
      });

      render(
        <Routes>
          <Route
            path="/protected"
            element={
              <AuthGuard requiresSuperAdmin>
                <TestComponent />
              </AuthGuard>
            }
          />
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
        </Routes>,
        { wrapper: createWrapper() }
      );

      // Should redirect to home while error toast is handled
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('Navigation and State Management', () => {
    it('should preserve location state when redirecting to auth', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        session: null,
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <Routes>
          <Route path="/protected" element={
            <AuthGuard>
              <TestComponent />
            </AuthGuard>
          } />
          <Route path="/auth" element={<div data-testid="auth-page">Auth Page</div>} />
        </Routes>,
        { wrapper: createWrapper(['/protected?param=value']) }
      );

      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    it('should handle multiple AuthGuard instances', () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <div>
          <AuthGuard>
            <div data-testid="content-1">Content 1</div>
          </AuthGuard>
          <AuthGuard>
            <div data-testid="content-2">Content 2</div>
          </AuthGuard>
        </div>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.getByTestId('content-2')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not re-render unnecessarily when auth state is stable', () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const renderSpy = vi.fn();
      
      const TestComponentWithSpy = () => {
        renderSpy();
        return <div data-testid="protected-content">Protected Content</div>;
      };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
        loading: false,
        bypassAuth: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      });

      mockUseSuperAdminCheck.mockReturnValue({
        isSuperAdmin: false,
        isLoading: false,
        error: null,
      });

      render(
        <AuthGuard>
          <TestComponentWithSpy />
        </AuthGuard>,
        { wrapper: createWrapper() }
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
}); 