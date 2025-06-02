
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Key } from 'lucide-react';
import CreateUserDialog from '@/components/superadmin/CreateUserDialog';
import ResetPasswordDialog from '@/components/tenant-user-manager/ResetPasswordDialog';
import { useToast } from '@/hooks/use-toast';
import { useSuperAdminUsers } from '@/hooks/useSuperAdminUsers';

interface UserWithTenant {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  tenant_name: string | null;
  tenant_id: string | null;
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{
    isOpen: boolean;
    userId: string;
    userEmail: string;
  }>({
    isOpen: false,
    userId: "",
    userEmail: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { resetPasswordPending, handleResetPassword } = useSuperAdminUsers();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get tenant associations for each user
      const usersWithTenants: UserWithTenant[] = await Promise.all(
        profiles.map(async (profile) => {
          const { data: tenantAssociation } = await supabase
            .from('user_tenants')
            .select(`
              tenant_id,
              tenants:tenant_id (
                id,
                name
              )
            `)
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            ...profile,
            tenant_name: tenantAssociation?.tenants?.name || null,
            tenant_id: tenantAssociation?.tenant_id || null
          };
        })
      );

      return usersWithTenants;
    },
  });

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.tenant_name && user.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const handleCreateSuccess = () => {
    toast({
      title: "User created successfully",
      description: "The user has been added to the system",
    });
    queryClient.invalidateQueries({ queryKey: ['users'] });
    setIsCreateDialogOpen(false);
  };

  const handleResetPasswordClick = (userId: string, userEmail: string) => {
    setResetPasswordDialog({
      isOpen: true,
      userId,
      userEmail
    });
  };

  const handleResetPasswordConfirm = (newPassword: string) => {
    handleResetPassword(resetPasswordDialog.userId, newPassword);
    setResetPasswordDialog({
      isOpen: false,
      userId: "",
      userEmail: ""
    });
  };

  const handleResetPasswordClose = () => {
    setResetPasswordDialog({
      isOpen: false,
      userId: "",
      userEmail: ""
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users registered on the JobMojo.ai platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>User List</CardTitle>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users or tenants..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'N/A'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.tenant_name ? (
                            <Badge variant="outline">
                              {user.tenant_name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">No tenant</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPasswordClick(user.id, user.email)}
                            title="Reset Password"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <CreateUserDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSuccess={handleCreateSuccess}
      />

      <ResetPasswordDialog
        isOpen={resetPasswordDialog.isOpen}
        onClose={handleResetPasswordClose}
        onConfirm={handleResetPasswordConfirm}
        userEmail={resetPasswordDialog.userEmail}
        isLoading={resetPasswordPending}
      />
    </AdminLayout>
  );
};

export default Users;
