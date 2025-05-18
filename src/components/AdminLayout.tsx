import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Home, 
  Settings, 
  User, 
  Users, 
  LogOut,
  Building,
  Briefcase,
  UserRound
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're in superadmin or tenant-admin route
  const isSuperAdmin = location.pathname.startsWith('/superadmin');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-jobmojo-primary">JobMojo.ai</h2>
          <p className="text-xs text-gray-600">
            {isSuperAdmin ? "Super Admin Dashboard" : "Tenant Admin Dashboard"}
          </p>
        </div>
        <nav className="p-4 space-y-2">
          {isSuperAdmin ? (
            // SuperAdmin Navigation Links
            <>
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
            </>
          ) : (
            // Tenant Admin Navigation Links
            <>
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
                <Users className="mr-2 h-4 w-4" /> Talent
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
                onClick={() => navigate("/tenant-admin/contacts")}
              >
                <ContactRound className="mr-2 h-4 w-4" /> Contacts
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
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 text-center text-sm text-gray-600 shadow-inner">
          © {new Date().getFullYear()} JobMojo.ai - {isSuperAdmin ? "Super Admin Portal" : "Tenant Admin Portal"}
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
