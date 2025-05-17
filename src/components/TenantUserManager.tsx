
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTenantUsers } from "@/components/tenant-user-manager/useTenantUsers";
import AddUserForm from "@/components/tenant-user-manager/AddUserForm";
import UserTable from "@/components/tenant-user-manager/UserTable";
import { TenantUserManagerProps } from "@/components/tenant-user-manager/types";

const TenantUserManager: React.FC<TenantUserManagerProps> = ({
  tenantId,
  tenantName,
  isOpen,
  onClose,
}) => {
  const {
    selectedUserId,
    setSelectedUserId,
    selectedRole,
    setSelectedRole,
    selectedDepartment,
    setSelectedDepartment,
    availableUsers,
    tenantUsers,
    isLoading,
    addUserPending,
    handleAddUser,
    handleRoleChange,
    removeUserMutation
  } = useTenantUsers(tenantId);

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
          <AddUserForm 
            availableUsers={availableUsers}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            handleAddUser={handleAddUser}
            isPending={addUserPending}
          />

          {/* User list */}
          <UserTable 
            tenantUsers={tenantUsers}
            isLoading={isLoading}
            onRoleChange={handleRoleChange}
            onRemoveUser={(id) => removeUserMutation.mutate(id)}
          />
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TenantUserManager;
