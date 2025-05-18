
import React from "react";
import { useNavigate } from "react-router-dom";
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
  
  return (
    <nav className="p-4 space-y-2">
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/dashboard")}
      >
        <Home className="mr-2 h-4 w-4" /> Dashboard
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/tenants")}
      >
        <Building className="mr-2 h-4 w-4" /> Tenants
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/settings")}
      >
        <Settings className="mr-2 h-4 w-4" /> Tenant Settings
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/users")}
      >
        <Users className="mr-2 h-4 w-4" /> Users
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/people")}
      >
        <UserRound className="mr-2 h-4 w-4" /> People
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/superadmin/companies")}
      >
        <Building className="mr-2 h-4 w-4" /> Companies
      </Button>
    </nav>
  );
};

export default SuperAdminNav;
