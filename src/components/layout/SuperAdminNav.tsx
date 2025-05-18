
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Settings, 
  Users, 
  Building,
  Briefcase,
  UserRound
} from "lucide-react";

const SuperAdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "secondary" : "ghost";
  };
  
  return (
    <nav className="p-4 space-y-2">
      <Button 
        variant={isActive("/superadmin/dashboard")}
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/dashboard")}
      >
        <Home className="mr-2 h-4 w-4" /> Dashboard
      </Button>
      <Button 
        variant={isActive("/superadmin/tenants")}
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/tenants")}
      >
        <Building className="mr-2 h-4 w-4" /> Tenants
      </Button>
      <Button 
        variant={isActive("/superadmin/settings")}
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/settings")}
      >
        <Settings className="mr-2 h-4 w-4" /> Tenant Settings
      </Button>
      <Button 
        variant={isActive("/superadmin/users")}
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/users")}
      >
        <Users className="mr-2 h-4 w-4" /> Users
      </Button>
      <Button 
        variant={isActive("/superadmin/people")}
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/people")}
      >
        <UserRound className="mr-2 h-4 w-4" /> People
      </Button>
      <Button 
        variant={isActive("/superadmin/companies")}
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/companies")}
      >
        <Building className="mr-2 h-4 w-4" /> Companies
      </Button>
    </nav>
  );
};

export default SuperAdminNav;
