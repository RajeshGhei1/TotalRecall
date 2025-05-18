
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

const TenantAdminNav = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="p-4 space-y-2">
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/tenant-admin/dashboard")}
      >
        <Home className="mr-2 h-4 w-4" /> Dashboard
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/tenant-admin/users")}
      >
        <Users className="mr-2 h-4 w-4" /> Users
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/tenant-admin/talent")}
      >
        <UserRound className="mr-2 h-4 w-4" /> Talent
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/tenant-admin/contacts")}
      >
        <UserRound className="mr-2 h-4 w-4" /> Contacts
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/tenant-admin/companies")}
      >
        <Building className="mr-2 h-4 w-4" /> Companies
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/tenant-admin/jobs")}
      >
        <Briefcase className="mr-2 h-4 w-4" /> Jobs
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => navigate("/tenant-admin/settings")}
      >
        <Settings className="mr-2 h-4 w-4" /> Settings
      </Button>
    </nav>
  );
};

export default TenantAdminNav;
