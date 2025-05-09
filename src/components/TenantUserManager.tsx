
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
import { Trash, UserPlus, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

interface TenantUserAssociation {
  id: string;
  user_id: string;
  tenant_id: string;
  user_role: string;
  department: string | null;
  user: User;
}

interface TenantUserManagerProps {
  tenantId: string;
  tenantName: string;
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'tenant_admin' | 'manager' | 'recruiter' | 'user';

const TenantUserManager: React.FC<TenantUserManagerProps> = ({
  tenantId,
  tenantName,
  isOpen,
  onClose,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const queryClient = useQueryClient();

  const departments = [
    { id: "recruiting", name: "Recruiting" },
    { id: "sales", name: "Sales" },
    { id: "marketing", name: "Marketing" },
    { id: "operations", name: "Operations" },
    { id: "hr", name: "Human Resources" },
  ];

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
          user_role,
          department,
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
    mutationFn: async ({ userId, role, department }: { userId: string, role: string, department?: string }) => {
      const { data, error } = await supabase
        .from("user_tenants")
        .insert([{ 
          user_id: userId, 
          tenant_id: tenantId,
          user_role: role,
          department: department || null
        }])
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
      setSelectedRole("user");
      setSelectedDepartment("");
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to remove user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update user role
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => {
      const { error } = await supabase
        .from("user_tenants")
        .update({ user_role: role })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Role updated",
        description: "User role has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update role: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleAddUser = () => {
    if (selectedUserId) {
      addUserMutation.mutate({ 
        userId: selectedUserId, 
        role: selectedRole,
        department: selectedDepartment
      });
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const association = tenantUsers.find(tu => tu.user.id === userId);
    if (association) {
      updateUserRoleMutation.mutate({ id: association.id, role: newRole });
    }
  };

  // Get the role display name
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      "tenant_admin": "Admin",
      "manager": "Manager", 
      "recruiter": "Recruiter",
      "user": "User"
    };
    return roleMap[role] || role;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Users for {tenantName}</DialogTitle>
          <DialogDescription>
            Add or remove users and assign roles in this tenant organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add user form */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5">
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
            <div className="col-span-3">
              <label htmlFor="role-select" className="block text-sm font-medium mb-1">
                Role
              </label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenant_admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <label htmlFor="department-select" className="block text-sm font-medium mb-1">
                Department
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 flex items-end">
              <Button 
                onClick={handleAddUser} 
                disabled={!selectedUserId || addUserMutation.isPending}
                className="w-full"
              >
                <UserPlus className="h-4 w-4" /> 
              </Button>
            </div>
          </div>

          {/* User list */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tenantUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No users in this tenant yet
                    </TableCell>
                  </TableRow>
                ) : (
                  tenantUsers.map((association) => (
                    <TableRow key={association.id}>
                      <TableCell>{association.user.email}</TableCell>
                      <TableCell>{association.user.full_name || "N/A"}</TableCell>
                      <TableCell>
                        {departments.find(d => d.id === association.department)?.name || "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {association.user_role === "tenant_admin" && <Shield className="h-4 w-4 text-blue-600" />}
                          <Select 
                            value={association.user_role || "user"} 
                            onValueChange={(value) => handleRoleChange(association.user.id, value)}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tenant_admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="recruiter">Recruiter</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
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
