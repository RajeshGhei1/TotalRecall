import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import EnhancedExportDialog from '../EnhancedExportDialog';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

vi.mock('@/hooks/useFeatureAccess', () => ({
  useFeatureUsageTracking: vi.fn(() => ({
    trackUsage: { mutate: vi.fn() },
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('EnhancedExportDialog', () => {
  const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

  beforeEach(async () => {
    vi.clearAllMocks();
    const { supabase } = await import('@/integrations/supabase/client');
    (supabase.rpc as unknown as vi.Mock).mockResolvedValue({ error: null });

    global.URL.createObjectURL = vi.fn(() => 'blob:export-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    anchorClickSpy.mockClear();
  });

  it('enforces rate limit and tracks usage on export', async () => {
    const onClose = vi.fn();
    render(
      <EnhancedExportDialog
        isOpen
        onClose={onClose}
        companies={[{ id: '1', name: 'TestCo', created_at: '2024-01-01T00:00:00Z' } as unknown as { id: string; name: string; created_at: string }]}
        tenantId="tenant-1"
      />,
      { wrapper: createWrapper() }
    );

    const exportButton = screen.getByRole('button', { name: /export 1 companies/i });
    exportButton.click();

    const { supabase } = await import('@/integrations/supabase/client');
    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith('enforce_rate_limit', {
        p_action: 'companies.export',
      });
    });

    const { useFeatureUsageTracking } = await import('@/hooks/useFeatureAccess');
    const trackingHook = (useFeatureUsageTracking as unknown as vi.Mock).mock.results[0].value;
    await waitFor(() => {
      expect(trackingHook.trackUsage.mutate).toHaveBeenCalledWith({
        tenantId: 'tenant-1',
        moduleName: 'data_management',
        featureId: 'bulk-upload-download',
      });
    });
  });
});

