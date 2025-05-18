
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  User, 
  LogOut,
} from "lucide-react";

interface AdminHeaderProps {
  isSuperAdmin: boolean;
}

const AdminHeader = ({ isSuperAdmin }: AdminHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        {isSuperAdmin ? "Super Admin Portal" : "Tenant Admin Portal"}
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" /> 
            {user?.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(isSuperAdmin ? "/superadmin/profile" : "/tenant-admin/profile")}>
            <User className="h-4 w-4 mr-2" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(isSuperAdmin ? "/superadmin/settings" : "/tenant-admin/settings")}>
            <Settings className="h-4 w-4 mr-2" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default AdminHeader;
