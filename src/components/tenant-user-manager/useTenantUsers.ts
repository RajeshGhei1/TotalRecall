
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TenantUserAssociation, UserRole } from "./types";
import { User } from "@/types/user";

export const useTenantUsers = (tenantId: string) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
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
  });

  // Fetch current tenant users
  const { data: tenantUsers = [], isLoading } = useQuery({
    queryKey: ["tenantUsers", tenantId],
    queryFn: async () => {
      // First get the user_tenant associations
      const { data: userTenants, error: userTenantsError } = await supabase
        .from("user_tenants")
        .select(`
          id, 
          user_id, 
          tenant_id,
          user_role,
          department
        `)
        .eq("tenant_id", tenantId);

      if (userTenantsError) {
        console.error("Error fetching tenant users:", userTenantsError);
        return [] as TenantUserAssociation[];
      }
      
      // Then get the user details separately and merge them
      const result: TenantUserAssociation[] = [];
      
      for (const userTenant of userTenants) {
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .eq("id", userTenant.user_id)
          .single();
          
        if (!userError && userData) {
          result.push({
            ...userTenant,
            user: userData
          });
        }
      }
      
      return result;
    },
    enabled: !!tenantId,
  });

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

  // Filter out users that are already in the tenant
  const filteredAvailableUsers = availableUsers.filter(
    (user) => !tenantUsers.some((tu) => tu.user.id === user.id)
  );

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
    handleAddUser,
    handleRoleChange,
    removeUserMutation
  };
};

export const departments = [
  { id: "recruiting", name: "Recruiting" },
  { id: "sales", name: "Sales" },
  { id: "marketing", name: "Marketing" },
  { id: "operations", name: "Operations" },
  { id: "hr", name: "Human Resources" },
];

export const getRoleDisplayName = (role: string) => {
  const roleMap: Record<string, string> = {
    "tenant_admin": "Admin",
    "manager": "Manager", 
    "recruiter": "Recruiter",
    "user": "User"
  };
  return roleMap[role] || role;
};
