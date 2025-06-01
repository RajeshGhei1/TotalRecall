
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Brain, Sparkles } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import UserProfileMenu from "./UserProfileMenu";
import { useAdminContext } from "@/hooks/useAdminContext";

const AdminHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminType, isLoading } = useAdminContext();

  const isSuperAdmin = adminType === 'super_admin';

  return (
    <header className="bg-white border-b px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center md:hidden">
      <div className="flex items-center">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 h-8 w-8 sm:h-10 sm:w-10">
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-jobmojo-primary to-jobmojo-secondary rounded-lg flex items-center justify-center">
              <Brain className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
            </div>
            <Sparkles className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2 w-2 sm:h-3 sm:w-3 text-jobmojo-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-jobmojo-primary to-jobmojo-secondary bg-clip-text text-transparent">
              TOTAL RECALL
            </span>
            <span className="text-xs text-jobmojo-accent font-semibold -mt-0.5">.ai</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default AdminHeader;
