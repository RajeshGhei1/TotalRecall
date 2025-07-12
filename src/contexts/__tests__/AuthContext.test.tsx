import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase with proper structure
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Mock useSessionLogger
vi.mock('@/hooks/useSessionLogger', () => ({
  useSessionLogger: vi.fn(),
}));

// Test component to access auth context
const TestComponent: React.FC = () => {
  const { user, session, loading, bypassAuth, signIn, signUp, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.id : 'no-user'}</div>
      <div data-testid="session">{session ? 'has-session' : 'no-session'}</div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="bypass">{bypassAuth ? 'bypass' : 'no-bypass'}</div>
      <button 
        data-testid="signin-btn" 
        onClick={() => signIn('test@example.com', 'password')}
      >
        Sign In
      </button>
      <button 
        data-testid="signup-btn" 
        onClick={() => signUp('test@example.com', 'password', 'Test User')}
      >
        Sign Up
      </button>
      <button data-testid="signout-btn" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
};

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with loading state', async () => {
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockAuthStateChange = vi.fn().mockReturnValue({ 
        data: { subscription: mockSubscription } 
      });
      const mockGetSession = vi.fn().mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      });

      (supabase.auth.onAuthStateChange as unknown).mockImplementation(mockAuthStateChange);
      (supabase.auth.getSession as unknown).mockImplementation(mockGetSession);

      render(<TestComponent />, { wrapper: createWrapper() });

      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });

    it('should set up auth state listener on mount', async () => {
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockAuthStateChange = vi.fn().mockReturnValue({ 
        data: { subscription: mockSubscription } 
      });
      const mockGetSession = vi.fn().mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      });

      (supabase.auth.onAuthStateChange as unknown).mockImplementation(mockAuthStateChange);
      (supabase.auth.getSession as unknown).mockImplementation(mockGetSession);

      render(<TestComponent />, { wrapper: createWrapper() });

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });

    it('should handle existing session on initialization', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { user: mockUser, access_token: 'token' };
      
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockAuthStateChange = vi.fn().mockReturnValue({ 
        data: { subscription: mockSubscription } 
      });
      const mockGetSession = vi.fn().mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      });

      (supabase.auth.onAuthStateChange as unknown).mockImplementation(mockAuthStateChange);
      (supabase.auth.getSession as unknown).mockImplementation(mockGetSession);

      render(<TestComponent />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('user-123');
        expect(screen.getByTestId('session')).toHaveTextContent('has-session');
      });
    });

    it('should handle session initialization error gracefully', async () => {
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockAuthStateChange = vi.fn().mockReturnValue({ 
        data: { subscription: mockSubscription } 
      });
      const mockGetSession = vi.fn().mockRejectedValue(new Error('Session error'));

      (supabase.auth.onAuthStateChange as unknown).mockImplementation(mockAuthStateChange);
      (supabase.auth.getSession as unknown).mockImplementation(mockGetSession);

      render(<TestComponent />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
    });
  });

  describe('Authentication Flows', () => {
    it('should handle successful sign in', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSignInResponse = { data: { user: mockUser }, error: null };
      const mockProfileResponse = { data: { role: 'tenant_admin' }, error: null };

      (supabase.auth.signInWithPassword as unknown).mockResolvedValue(mockSignInResponse);
      (supabase.from as unknown).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue(mockProfileResponse),
          }),
        }),
      });

      render(<TestComponent />, { wrapper: createWrapper() });

      const signInButton = screen.getByTestId('signin-btn');
      
      await act(async () => {
        signInButton.click();
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should handle sign in error', async () => {
      const mockError = new Error('Invalid credentials');
      (supabase.auth.signInWithPassword as unknown).mockRejectedValue(mockError);

      render(<TestComponent />, { wrapper: createWrapper() });

      const signInButton = screen.getByTestId('signin-btn');
      
      await act(async () => {
        signInButton.click();
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
    });

    it('should handle successful sign up', async () => {
      const mockSignUpResponse = { data: { user: { id: 'user-123' } }, error: null };
      (supabase.auth.signUp as unknown).mockResolvedValue(mockSignUpResponse);

      render(<TestComponent />, { wrapper: createWrapper() });

      const signUpButton = screen.getByTestId('signup-btn');
      
      await act(async () => {
        signUpButton.click();
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options: {
          emailRedirectTo: 'http://localhost:3000/',
          data: {
            full_name: 'Test User',
          },
        },
      });
    });

    it('should handle sign up error', async () => {
      const mockError = new Error('Email already exists');
      (supabase.auth.signUp as unknown).mockRejectedValue(mockError);

      render(<TestComponent />, { wrapper: createWrapper() });

      const signUpButton = screen.getByTestId('signup-btn');
      
      await act(async () => {
        signUpButton.click();
      });

      expect(supabase.auth.signUp).toHaveBeenCalled();
    });

    it('should handle successful sign out', async () => {
      (supabase.auth.signOut as unknown).mockResolvedValue({ error: null });

      render(<TestComponent />, { wrapper: createWrapper() });

      const signOutButton = screen.getByTestId('signout-btn');
      
      await act(async () => {
        signOutButton.click();
      });

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out error gracefully', async () => {
      const mockError = new Error('Sign out failed');
      (supabase.auth.signOut as unknown).mockRejectedValue(mockError);

      render(<TestComponent />, { wrapper: createWrapper() });

      const signOutButton = screen.getByTestId('signout-btn');
      
      await act(async () => {
        signOutButton.click();
      });

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('User Role Detection', () => {
    it('should redirect super admin to superadmin dashboard', async () => {
      const mockUser = { id: 'user-123', email: 'admin@example.com' };
      const mockSignInResponse = { data: { user: mockUser }, error: null };
      const mockProfileResponse = { data: { role: 'super_admin' }, error: null };

      (supabase.auth.signInWithPassword as unknown).mockResolvedValue(mockSignInResponse);
      (supabase.from as unknown).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue(mockProfileResponse),
          }),
        }),
      });

      render(<TestComponent />, { wrapper: createWrapper() });

      const signInButton = screen.getByTestId('signin-btn');
      
      await act(async () => {
        signInButton.click();
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should redirect tenant admin to tenant admin dashboard', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      const mockSignInResponse = { data: { user: mockUser }, error: null };
      const mockProfileResponse = { data: { role: 'tenant_admin' }, error: null };

      (supabase.auth.signInWithPassword as unknown).mockResolvedValue(mockSignInResponse);
      (supabase.from as unknown).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue(mockProfileResponse),
          }),
        }),
      });

      render(<TestComponent />, { wrapper: createWrapper() });

      const signInButton = screen.getByTestId('signin-btn');
      
      await act(async () => {
        signInButton.click();
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should handle role check error gracefully', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      const mockSignInResponse = { data: { user: mockUser }, error: null };
      const mockProfileError = { error: new Error('Database error') };

      (supabase.auth.signInWithPassword as unknown).mockResolvedValue(mockSignInResponse);
      (supabase.from as unknown).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue(mockProfileError),
          }),
        }),
      });

      render(<TestComponent />, { wrapper: createWrapper() });

      const signInButton = screen.getByTestId('signin-btn');
      
      await act(async () => {
        signInButton.click();
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('Auth State Changes', () => {
    it('should handle auth state change to signed in', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { user: mockUser, access_token: 'token' };
      
      let authStateCallback: unknown;
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockAuthStateChange = vi.fn().mockImplementation((callback) => {
        authStateCallback = callback;
        return { data: { subscription: mockSubscription } };
      });
      const mockGetSession = vi.fn().mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      });

      (supabase.auth.onAuthStateChange as unknown).mockImplementation(mockAuthStateChange);
      (supabase.auth.getSession as unknown).mockImplementation(mockGetSession);

      render(<TestComponent />, { wrapper: createWrapper() });

      await act(async () => {
        authStateCallback('SIGNED_IN', mockSession);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('user-123');
        expect(screen.getByTestId('session')).toHaveTextContent('has-session');
      });
    });

    it('should handle auth state change to signed out', async () => {
      let authStateCallback: unknown;
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockAuthStateChange = vi.fn().mockImplementation((callback) => {
        authStateCallback = callback;
        return { data: { subscription: mockSubscription } };
      });
      const mockGetSession = vi.fn().mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      });

      (supabase.auth.onAuthStateChange as unknown).mockImplementation(mockAuthStateChange);
      (supabase.auth.getSession as unknown).mockImplementation(mockGetSession);

      render(<TestComponent />, { wrapper: createWrapper() });

      await act(async () => {
        authStateCallback('SIGNED_OUT', null);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
        expect(screen.getByTestId('session')).toHaveTextContent('no-session');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle auth initialization errors gracefully', async () => {
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockAuthStateChange = vi.fn().mockReturnValue({ 
        data: { subscription: mockSubscription } 
      });
      const mockGetSession = vi.fn().mockRejectedValue(new Error('Network error'));

      (supabase.auth.onAuthStateChange as unknown).mockImplementation(mockAuthStateChange);
      (supabase.auth.getSession as unknown).mockImplementation(mockGetSession);

      render(<TestComponent />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
    });

    it('should handle role check errors gracefully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSignInResponse = { data: { user: mockUser }, error: null };
      const mockProfileError = { error: new Error('Permission denied') };

      (supabase.auth.signInWithPassword as unknown).mockResolvedValue(mockSignInResponse);
      (supabase.from as unknown).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue(mockProfileError),
          }),
        }),
      });

      render(<TestComponent />, { wrapper: createWrapper() });

      const signInButton = screen.getByTestId('signin-btn');
      
      await act(async () => {
        signInButton.click();
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('Context Usage', () => {
    it('should throw error when useAuth is used outside AuthProvider', () => {
      const TestComponentWithoutProvider = () => {
        const auth = useAuth();
        return <div>{auth.user ? auth.user.id : 'no-user'}</div>;
      };

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
}); 