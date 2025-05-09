
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Search, Building, Edit, PenLine } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import TenantUserManager from "@/components/TenantUserManager";

interface Tenant {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const TenantAdminTenants = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userManagerOpen, setUserManagerOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantDescription, setNewTenantDescription] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Fetch all tenants for the current user
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['userTenants'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          tenant_id,
          tenants:tenant_id (
            id,
            name,
            description,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Transform to match Tenant interface and remove duplicates
      const uniqueTenants = Array.from(
        new Map(data.map(item => [item.tenants.id, item.tenants])).values()
      ) as Tenant[];
      
      return uniqueTenants;
    },
    enabled: !!user,
  });

  // Filter tenants based on search term
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (tenant.description && tenant.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Create a new tenant
  const createTenantMutation = useMutation({
    mutationFn: async () => {
      // Create the tenant
      const { data: newTenant, error: tenantError } = await supabase
        .from('tenants')
        .insert([
          { name: newTenantName.trim(), description: newTenantDescription.trim() || null }
        ])
        .select('id')
        .single();
      
      if (tenantError) throw tenantError;
      
      // Associate the current user with the new tenant
      const { error: userTenantError } = await supabase
        .from('user_tenants')
        .insert([
          { user_id: user!.id, tenant_id: newTenant.id }
        ]);
      
      if (userTenantError) throw userTenantError;
      
      return newTenant;
    },
    onSuccess: () => {
      toast({
        title: "Tenant created",
        description: "New tenant has been created successfully",
      });
      
      setNewTenantName("");
      setNewTenantDescription("");
      setCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['userTenants'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating tenant",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Update an existing tenant
  const updateTenantMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTenant) return;
      
      const { error } = await supabase
        .from('tenants')
        .update({
          name: newTenantName.trim(),
          description: newTenantDescription.trim() || null
        })
        .eq('id', selectedTenant.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Tenant updated",
        description: "Tenant information has been updated successfully",
      });
      
      setSelectedTenant(null);
      setNewTenantName("");
      setNewTenantDescription("");
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['userTenants'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating tenant",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  const handleCreateTenant = () => {
    if (!newTenantName.trim()) {
      toast({
        title: "Validation error",
        description: "Tenant name is required",
        variant: "destructive",
      });
      return;
    }
    
    createTenantMutation.mutate();
  };

  const handleUpdateTenant = () => {
    if (!newTenantName.trim()) {
      toast({
        title: "Validation error",
        description: "Tenant name is required",
        variant: "destructive",
      });
      return;
    }
    
    updateTenantMutation.mutate();
  };

  const handleEditClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setNewTenantName(tenant.name);
    setNewTenantDescription(tenant.description || "");
    setEditDialogOpen(true);
  };

  const handleUsersClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setUserManagerOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tenant Admin Tenants</h1>

        <Card>
          <CardHeader>
            <CardTitle>Tenant Organizations</CardTitle>
            <CardDescription>
              Manage the tenant organizations you have access to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Building className="mr-2 h-4 w-4" /> Create Tenant
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading tenants...</div>
            ) : filteredTenants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No tenants match your search" : "No tenants found"}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredTenants.map((tenant) => (
                  <Card key={tenant.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>{tenant.name}</CardTitle>
                      {tenant.description && (
                        <CardDescription className="line-clamp-2">{tenant.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Created on {new Date(tenant.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUsersClick(tenant)}
                        >
                          <Users className="h-4 w-4 mr-1" /> Users
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(tenant)}
                        >
                          <PenLine className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Tenant Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
            <DialogDescription>
              Create a new tenant organization in the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="tenant-name" className="text-sm font-medium">
                Tenant Name
              </label>
              <Input
                id="tenant-name"
                placeholder="Acme Corporation"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="tenant-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="tenant-description"
                placeholder="Brief description of the tenant organization"
                value={newTenantDescription}
                onChange={(e) => setNewTenantDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)}
              disabled={createTenantMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTenant}
              disabled={!newTenantName.trim() || createTenantMutation.isPending}
            >
              {createTenantMutation.isPending ? "Creating..." : "Create Tenant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tenant Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update the tenant organization details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-tenant-name" className="text-sm font-medium">
                Tenant Name
              </label>
              <Input
                id="edit-tenant-name"
                placeholder="Tenant name"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-tenant-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="edit-tenant-description"
                placeholder="Brief description of the tenant organization"
                value={newTenantDescription}
                onChange={(e) => setNewTenantDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={updateTenantMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTenant}
              disabled={!newTenantName.trim() || updateTenantMutation.isPending}
            >
              {updateTenantMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Manager Dialog */}
      {selectedTenant && (
        <TenantUserManager
          tenantId={selectedTenant.id}
          tenantName={selectedTenant.name}
          isOpen={userManagerOpen}
          onClose={() => setUserManagerOpen(false)}
        />
      )}
    </AdminLayout>
  );
};

export default TenantAdminTenants;
