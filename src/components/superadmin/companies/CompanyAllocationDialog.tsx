import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/hooks/useCompanies';
import { useTenants } from '@/hooks/useTenants';

interface CompanyAllocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
}

interface AllocationRecord {
  id: string;
  tenant_id: string;
  allocation_type: string;
  allocated_at: string;
  expires_at?: string | null;
  notes?: string | null;
}

const CompanyAllocationDialog: React.FC<CompanyAllocationDialogProps> = ({
  isOpen,
  onClose,
  company,
}) => {
  const { tenants } = useTenants();
  const [allocations, setAllocations] = useState<AllocationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [allocationType, setAllocationType] = useState<string>('subscription');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const tenantNameById = useMemo(() => {
    const map = new Map<string, string>();
    tenants.forEach((tenant) => map.set(tenant.id, tenant.name));
    return map;
  }, [tenants]);

  useEffect(() => {
    if (!isOpen || !company) return;
    const loadAllocations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('company_data_allocations')
          .select('id, tenant_id, allocation_type, allocated_at, expires_at, notes')
          .eq('company_id', company.id)
          .order('allocated_at', { ascending: false });

        if (error) throw error;
        setAllocations((data || []) as AllocationRecord[]);
      } catch (error) {
        toast.error('Failed to load allocations');
        setAllocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllocations();
  }, [isOpen, company]);

  const resetForm = () => {
    setSelectedTenantId('');
    setAllocationType('subscription');
    setExpiresAt('');
    setNotes('');
  };

  const handleAllocate = async () => {
    if (!company) return;
    if (!selectedTenantId) {
      toast.error('Select a tenant to allocate data');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.rpc('allocate_company_to_tenant', {
        p_company_id: company.id,
        p_tenant_id: selectedTenantId,
        p_allocation_type: allocationType || 'subscription',
        p_expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        p_notes: notes || null,
      });

      if (error) throw error;
      toast.success('Company allocated to tenant');
      resetForm();

      const { data, error: reloadError } = await supabase
        .from('company_data_allocations')
        .select('id, tenant_id, allocation_type, allocated_at, expires_at, notes')
        .eq('company_id', company.id)
        .order('allocated_at', { ascending: false });

      if (reloadError) throw reloadError;
      setAllocations((data || []) as AllocationRecord[]);
    } catch (error) {
      toast.error('Failed to allocate company data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevoke = async (tenantId: string) => {
    if (!company) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.rpc('revoke_company_allocation', {
        p_company_id: company.id,
        p_tenant_id: tenantId,
      });

      if (error) throw error;
      setAllocations((prev) => prev.filter((allocation) => allocation.tenant_id !== tenantId));
      toast.success('Allocation revoked');
    } catch (error) {
      toast.error('Failed to revoke allocation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Allocate Company Data</DialogTitle>
          <DialogDescription>
            Allocate platform or app-owned company data to a tenant for subscription access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border p-4 space-y-3">
            <div className="text-sm text-muted-foreground">
              Company: <span className="font-medium text-foreground">{company?.name}</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tenant</Label>
                <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Allocation Type</Label>
                <Select value={allocationType} onValueChange={setAllocationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional notes"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAllocate} disabled={isSaving}>
                Allocate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Existing Allocations</div>
            <ScrollArea className="h-48 rounded-md border">
              <div className="space-y-3 p-3">
                {isLoading && <div className="text-sm text-muted-foreground">Loading allocations...</div>}
                {!isLoading && allocations.length === 0 && (
                  <div className="text-sm text-muted-foreground">No allocations yet.</div>
                )}
                {allocations.map((allocation) => (
                  <div
                    key={allocation.id}
                    className="flex items-start justify-between gap-3 rounded-md border p-3"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {tenantNameById.get(allocation.tenant_id) || allocation.tenant_id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Allocated {new Date(allocation.allocated_at).toLocaleString()}
                      </div>
                      {allocation.expires_at && (
                        <div className="text-xs text-muted-foreground">
                          Expires {new Date(allocation.expires_at).toLocaleString()}
                        </div>
                      )}
                      {allocation.notes && (
                        <div className="text-xs text-muted-foreground">{allocation.notes}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{allocation.allocation_type}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevoke(allocation.tenant_id)}
                        disabled={isSaving}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyAllocationDialog;

