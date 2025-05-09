import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Search, Edit, Trash, Shield, Users, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TenantUserManager from "@/components/TenantUserManager";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  user_role?: string;
  manager_id?: string | null;
  department?: string | null;
  association_id: string;
}

type UserRole = 'tenant_admin' | 'manager' | 'recruiter' | 'user';

interface Department {
  id: string;
  name: string;
}

const TenantAdminUsers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [userDepartment, setUserDepartment] = useState("");
  const [userManager, setUserManager] = useState("");
  const [showUserManagerDialog, setShowUserManagerDialog] = useState(false);

  const departments: Department[] = [
    { id: "recruiting", name: "Recruiting" },
    { id: "sales", name: "Sales" },
    { id: "marketing", name: "Marketing" },
    { id: "operations", name: "Operations" },
    { id: "hr", name: "Human Resources" },
  ];

  // Fetch tenant information for the current user
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          tenant_id,
          tenants:tenant_id (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch users for this tenant
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['tenantUsers', tenantData?.tenant_id],
    queryFn: async () => {
      if (!tenantData?.tenant_id) return [];
      
      // First get the user_tenant associations
      const { data: userTenants, error: userTenantsError } = await supabase
        .from('user_tenants')
        .select(`
          id,
          user_id,
          user_role,
          manager_id,
          department
        `)
        .eq('tenant_id', tenantData.tenant_id);

      if (userTenantsError) {
        console.error("Error fetching tenant users:", userTenantsError);
        return [];
      }
      
      // Then get the user details separately and merge them
      const result: User[] = [];
      
      for (const userTenant of userTenants) {
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", userTenant.user_id)
          .single();
          
        if (!userError && userData) {
          result.push({
            ...userData,
            user_role: userTenant.user_role || "user",
            manager_id: userTenant.manager_id,
            department: userTenant.department,
            association_id: userTenant.id
          });
        }
      }
      
      return result;
    },
    enabled: !!tenantData?.tenant_id,
  });

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get managers (users with manager or admin role)
  const managers = users.filter(user => 
    user.user_role === "tenant_admin" || user.user_role === "manager"
  );

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ associationId, role, managerId, department }: 
      { associationId: string, role: string, managerId?: string | null, department?: string | null }) => {
      const { error } = await supabase
        .from('user_tenants')
        .update({ 
          user_role: role,
          manager_id: managerId,
          department: department 
        })
        .eq('id', associationId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "User updated",
        description: "User role and organization details have been updated",
      });
      refetch();
      setEditUserDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  const handleAddUser = async () => {
    if (!newUserEmail || !tenantData?.tenant_id) return;

    try {
      // Check if user exists
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', newUserEmail.trim())
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      let userId = existingUser?.id;

      // If user doesn't exist, create one
      if (!userId) {
        const { data: newUser, error: createError } = await supabase
          .rpc('create_user_profile', {
            user_email: newUserEmail.trim(),
            user_full_name: newUserName.trim() || null,
            user_role: 'user'
          });

        if (createError) throw createError;
        userId = newUser;
      }

      // Check if user is already in tenant
      const { data: existingAssoc, error: assocError } = await supabase
        .from('user_tenants')
        .select('id')
        .eq('user_id', userId)
        .eq('tenant_id', tenantData.tenant_id);

      if (assocError) throw assocError;

      if (existingAssoc && existingAssoc.length > 0) {
        toast({
          title: "User already exists",
          description: "This user is already associated with this tenant",
          variant: "destructive",
        });
        return;
      }

      // Add user to tenant
      const { error: insertError } = await supabase
        .from('user_tenants')
        .insert([
          { 
            user_id: userId, 
            tenant_id: tenantData.tenant_id,
            user_role: userRole,
            department: userDepartment || null,
            manager_id: userManager || null
          }
        ]);

      if (insertError) throw insertError;

      toast({
        title: "User added",
        description: "User has been added to the tenant successfully",
      });

      // Reset form and close dialog
      setNewUserEmail("");
      setNewUserName("");
      setUserRole("user");
      setUserDepartment("");
      setUserManager("");
      setAddUserDialogOpen(false);
      refetch();

    } catch (error: any) {
      console.error("Error adding user:", error);
      toast({
        title: "Error adding user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUser = async (associationId: string) => {
    if (!confirm("Are you sure you want to remove this user from the tenant?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_tenants')
        .delete()
        .eq('id', associationId);

      if (error) throw error;

      toast({
        title: "User removed",
        description: "User has been removed from the tenant",
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error removing user:", error);
      toast({
        title: "Error removing user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setUserRole(user.user_role as UserRole || "user");
    setUserDepartment(user.department || "");
    setUserManager(user.manager_id || "");
    setEditUserDialogOpen(true);
  };

  const saveUserChanges = () => {
    if (!currentUser) return;

    updateUserRoleMutation.mutate({
      associationId: currentUser.association_id,
      role: userRole,
      managerId: userManager || null,
      department: userDepartment || null
    });
  };

  // Get the name of a manager by ID
  const getManagerName = (managerId: string | null | undefined) => {
    if (!managerId) return "None";
    const manager = users.find(u => u.id === managerId);
    return manager ? (manager.full_name || manager.email) : "Unknown";
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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tenant Admin Users</h1>
          {tenantData?.tenants?.name && (
            <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
              {tenantData.tenants.name}
            </div>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users, roles, and organization structure</CardDescription>
            <div className="flex mt-4 space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowUserManagerDialog(true)}
              >
                <Users className="mr-2 h-4 w-4" /> 
                Bulk User Management
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setAddUserDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Reports To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        {searchTerm ? "No users match your search" : "No users found in this tenant"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department || "Unassigned"}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {user.user_role === "tenant_admin" && <Shield className="h-4 w-4 mr-1 text-blue-600" />}
                            {user.user_role === "manager" && <UserCheck className="h-4 w-4 mr-1 text-green-600" />}
                            {getRoleDisplayName(user.user_role || "user")}
                          </div>
                        </TableCell>
                        <TableCell>{getManagerName(user.manager_id)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="Edit user"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            title="Remove from tenant"
                            onClick={() => handleRemoveUser(user.association_id)}
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
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add User to Tenant</DialogTitle>
            <DialogDescription>
              Add a new or existing user to this tenant organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If the user exists, they will be added to this tenant. If not, a new user will be created.
              </p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name (Optional)
              </label>
              <Input
                id="name"
                placeholder="John Smith"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
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
            <div className="grid gap-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <Select value={userDepartment} onValueChange={setUserDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="manager" className="text-sm font-medium">
                Reports To
              </label>
              <Select value={userManager} onValueChange={setUserManager}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {managers.map(manager => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.full_name || manager.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={!newUserEmail.trim()}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role and organization details
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-medium mb-1">User</p>
                <p>{currentUser.full_name || "N/A"} ({currentUser.email})</p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-role" className="text-sm font-medium">
                  Role
                </label>
                <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
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
              <div className="grid gap-2">
                <label htmlFor="edit-department" className="text-sm font-medium">
                  Department
                </label>
                <Select value={userDepartment} onValueChange={setUserDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-manager" className="text-sm font-medium">
                  Reports To
                </label>
                <Select value={userManager} onValueChange={setUserManager}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {managers
                      .filter(manager => manager.id !== currentUser.id) // Can't report to yourself
                      .map(manager => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.full_name || manager.email}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUserChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk User Management Dialog */}
      <TenantUserManager 
        tenantId={tenantData?.tenant_id || ""}
        tenantName={tenantData?.tenants?.name || ""}
        isOpen={showUserManagerDialog}
        onClose={() => setShowUserManagerDialog(false)} 
      />
    </AdminLayout>
  );
};

export default TenantAdminUsers;
