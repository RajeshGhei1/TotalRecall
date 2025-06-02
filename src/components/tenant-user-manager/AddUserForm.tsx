
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { departments } from "./useTenantUsers";
import { User } from "@/types/user";
import { UserRole } from "./types";

interface AddUserFormProps {
  availableUsers: User[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  handleAddUser: () => void;
  isPending: boolean;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  availableUsers,
  selectedUserId,
  setSelectedUserId,
  selectedRole,
  setSelectedRole,
  selectedDepartment,
  setSelectedDepartment,
  handleAddUser,
  isPending
}) => {
  return (
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
          {availableUsers.map((user) => (
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
            <SelectItem value="no-department">None</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 flex items-end">
        <Button 
          onClick={handleAddUser} 
          disabled={!selectedUserId || isPending}
          className="w-full"
        >
          <UserPlus className="h-4 w-4" /> 
        </Button>
      </div>
    </div>
  );
};

export default AddUserForm;
