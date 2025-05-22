
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RoleInputProps {
  role: string;
  onRoleChange: (value: string) => void;
}

const RoleInput: React.FC<RoleInputProps> = ({
  role,
  onRoleChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role</Label>
      <Input
        id="role"
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
      />
    </div>
  );
};

export default RoleInput;
