
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useAdminContext } from "@/hooks/useAdminContext";

const AdminHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminType, isLoading } = useAdminContext();

  const isSuperAdmin = adminType === 'super_admin';

  return (
    <header className="bg-white border-b px-4 py-3 flex justify-between items-center md:hidden">
      <div className="flex items-center">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold text-jobmojo-primary">
          TOTAL RECALL.ai
        </h1>
      </div>
      <div className="text-xs text-gray-500">
        {isLoading ? "Loading..." : (isSuperAdmin ? "Super Admin" : "Tenant Admin")}
      </div>
    </header>
  );
};

export default AdminHeader;
