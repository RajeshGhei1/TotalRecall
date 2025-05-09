
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Search, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

const TenantAdminUsers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");

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
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          id,
          user_id,
          user:profiles(id, email, full_name, role)
        `)
        .eq('tenant_id', tenantData.tenant_id);

      if (error) throw error;
      
      // Transform to match User interface
      return data.map(item => ({
        id: item.user.id,
        email: item.user.email,
        full_name: item.user.full_name,
        role: item.user.role,
        association_id: item.id
      }));
    },
    enabled: !!tenantData?.tenant_id,
  });

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          { user_id: userId, tenant_id: tenantData.tenant_id }
        ]);

      if (insertError) throw insertError;

      toast({
        title: "User added",
        description: "User has been added to the tenant successfully",
      });

      // Reset form and close dialog
      setNewUserEmail("");
      setNewUserName("");
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
            <CardDescription>Manage users associated with this tenant</CardDescription>
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
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        {searchTerm ? "No users match your search" : "No users found in this tenant"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit user">
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
        <DialogContent>
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
              <p className="text-xs text-muted-foreground">
                Only required when creating a new user.
              </p>
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
    </AdminLayout>
  );
};

export default TenantAdminUsers;
