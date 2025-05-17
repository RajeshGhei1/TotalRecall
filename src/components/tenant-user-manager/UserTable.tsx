
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash, Shield } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TenantUserAssociation } from "./types";
import { departments, getRoleDisplayName } from "./useTenantUsers";

interface UserTableProps {
  tenantUsers: TenantUserAssociation[];
  isLoading: boolean;
  onRoleChange: (userId: string, newRole: string) => void;
  onRemoveUser: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  tenantUsers,
  isLoading,
  onRoleChange,
  onRemoveUser
}) => {
  return (
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
                      onValueChange={(value) => onRoleChange(association.user.id, value)}
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
                    onClick={() => onRemoveUser(association.id)}
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
  );
};

export default UserTable;
