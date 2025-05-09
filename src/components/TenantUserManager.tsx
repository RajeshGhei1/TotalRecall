
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Trash, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

interface TenantUserAssociation {
  id: string;
  user_id: string;
  tenant_id: string;
  user: User;
}

interface TenantUserManagerProps {
  tenantId: string;
  tenantName: string;
  isOpen: boolean;
  onClose: () => void;
}

const TenantUserManager: React.FC<TenantUserManagerProps> = ({
  tenantId,
  tenantName,
  isOpen,
  onClose,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch all available users
  const { data: availableUsers = [] } = useQuery({
    queryKey: ["availableUsers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("email");

      if (error) throw error;
      return data as User[];
    },
    enabled: isOpen,
  });

  // Fetch current tenant users
  const { data: tenantUsers = [], isLoading } = useQuery({
    queryKey: ["tenantUsers", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_tenants")
        .select(`
          id, 
          user_id, 
          tenant_id,
          user:profiles(id, email, full_name)
        `)
        .eq("tenant_id", tenantId);

      if (error) throw error;
      return data as TenantUserAssociation[];
    },
    enabled: isOpen && !!tenantId,
  });

  // Filter out users that are already in the tenant
  const filteredAvailableUsers = availableUsers.filter(
    (user) => !tenantUsers.some((tu) => tu.user.id === user.id)
  );

  // Add user to tenant
  const addUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("user_tenants")
        .insert([{ user_id: userId, tenant_id: tenantId }])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "User added",
        description: "User has been added to the tenant successfully.",
      });
      setSelectedUserId("");
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Remove user from tenant
  const removeUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_tenants")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "User removed",
        description: "User has been removed from the tenant.",
      });
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleAddUser = () => {
    if (selectedUserId) {
      addUserMutation.mutate(selectedUserId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Users for {tenantName}</DialogTitle>
          <DialogDescription>
            Add or remove users from this tenant organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add user form */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="user-select" className="block text-sm font-medium mb-1">
                Add User
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select a user</option>
                {filteredAvailableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email} {user.full_name ? `(${user.full_name})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              onClick={handleAddUser} 
              disabled={!selectedUserId || addUserMutation.isPending}
            >
              <UserPlus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>

          {/* User list */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tenantUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No users in this tenant yet
                    </TableCell>
                  </TableRow>
                ) : (
                  tenantUsers.map((association) => (
                    <TableRow key={association.id}>
                      <TableCell>{association.user.email}</TableCell>
                      <TableCell>{association.user.full_name || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUserMutation.mutate(association.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TenantUserManager;
