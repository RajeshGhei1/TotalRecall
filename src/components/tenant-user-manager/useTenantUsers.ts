import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TenantUserAssociation, UserRole } from "./types";
import { User } from "@/types/user";

export const departments = [
  { id: "hr", name: "Human Resources" },
  { id: "engineering", name: "Engineering" },
  { id: "sales", name: "Sales" },
  { id: "marketing", name: "Marketing" },
  { id: "finance", name: "Finance" },
  { id: "operations", name: "Operations" }
];

export const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "tenant_admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "recruiter":
      return "Recruiter";
    default:
      return "User";
  }
};

export const useTenantUsers = (tenantId: string) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("no-department");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all available users
  const { data: availableUsers = [] } = useQuery({
    queryKey: ["available-users", tenantId],
    queryFn: async () => {
      const { data: existingUsers } = await supabase
        .from("user_tenants")
        .select("user_id")
        .eq("tenant_id", tenantId);

      const existingUserIds = existingUsers?.map(u => u.user_id) || [];

      const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .not("id", "in", `(${existingUserIds.length > 0 ? existingUserIds.join(",") : "null"})`);

      if (error) throw error;
      return users as User[];
    },
    enabled: !!tenantId,
  });

  // Fetch current tenant users
  const { data: tenantUsers = [], isLoading } = useQuery({
    queryKey: ["tenant-users", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_tenants")
        .select(`
          id,
          user_id,
          tenant_id,
          user_role,
          department,
          profiles!user_tenants_user_id_fkey (
            id,
            email,
            full_name
          )
        `)
        .eq("tenant_id", tenantId);

      if (error) throw error;
      
      // Transform the data to match TenantUserAssociation interface
      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        tenant_id: item.tenant_id,
        user_role: item.user_role,
        department: item.department,
        user: {
          id: item.profiles.id,
          email: item.profiles.email,
          full_name: item.profiles.full_name
        }
      })) as TenantUserAssociation[];
    },
    enabled: !!tenantId,
  });

  // Add user to tenant
  const addUserMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("user_tenants")
        .insert({
          user_id: selectedUserId,
          tenant_id: tenantId,
          user_role: selectedRole,
          department: selectedDepartment === "no-department" ? null : selectedDepartment
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "User added successfully",
        description: "The user has been added to this tenant.",
      });
      queryClient.invalidateQueries({ queryKey: ["tenant-users", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["available-users", tenantId] });
      setSelectedUserId("");
      setSelectedRole("user");
      setSelectedDepartment("no-department");
    },
    onError: (error) => {
      toast({
        title: "Error adding user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove user from tenant
  const removeUserMutation = useMutation({
    mutationFn: async (associationId: string) => {
      const { error } = await supabase
        .from("user_tenants")
        .delete()
        .eq("id", associationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "User removed successfully",
        description: "The user has been removed from this tenant.",
      });
      queryClient.invalidateQueries({ queryKey: ["tenant-users", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["available-users", tenantId] });
    },
    onError: (error) => {
      toast({
        title: "Error removing user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase
        .from("user_tenants")
        .update({ user_role: newRole })
        .eq("user_id", userId)
        .eq("tenant_id", tenantId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Role updated successfully",
        description: "The user's role has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["tenant-users", tenantId] });
    },
    onError: (error) => {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reset user password
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      const { error } = await supabase.functions.invoke('reset-user-password', {
        body: { userId, newPassword }
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Password reset successfully",
        description: "The user's password has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter out users that are already in the tenant
  const filteredAvailableUsers = availableUsers.filter(
    (user) => !tenantUsers.some((tu) => tu.user.id === user.id)
  );

  const handleAddUser = () => {
    if (selectedUserId) {
      addUserMutation.mutate();
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleResetPassword = (userId: string, newPassword: string) => {
    resetPasswordMutation.mutate({ userId, newPassword });
  };

  return {
    selectedUserId,
    setSelectedUserId,
    selectedRole,
    setSelectedRole,
    selectedDepartment,
    setSelectedDepartment,
    availableUsers: filteredAvailableUsers,
    tenantUsers,
    isLoading,
    addUserPending: addUserMutation.isPending,
    resetPasswordPending: resetPasswordMutation.isPending,
    handleAddUser,
    handleRoleChange,
    handleResetPassword,
    removeUserMutation
  };
};
