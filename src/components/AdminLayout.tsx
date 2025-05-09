
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
  Database, 
  Home, 
  Settings, 
  User, 
  Users, 
  LogOut,
  Award 
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-jobmojo-primary">JobMojo.ai</h2>
          <p className="text-xs text-gray-600">Admin Dashboard</p>
        </div>
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
            <Database className="mr-2 h-4 w-4" /> Tenants
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
            onClick={() => navigate("/superadmin/talents")}
          >
            <Award className="mr-2 h-4 w-4" /> Talents
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate("/superadmin/settings")}
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Portal</h1>
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
              <DropdownMenuItem onClick={() => navigate("/superadmin/profile")}>
                <User className="h-4 w-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/superadmin/settings")}>
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
          © {new Date().getFullYear()} JobMojo.ai - Admin Portal
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
