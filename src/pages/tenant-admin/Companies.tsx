
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";

const TenantAdminCompanies = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Companies</h1>
          <Button onClick={() => navigate("/tenant-admin/companies/add")}>
            <Plus className="h-4 w-4 mr-2" /> Add Company
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-12">
              <Building className="h-16 w-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No companies yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by adding your first company
              </p>
              <Button className="mt-4" onClick={() => navigate("/tenant-admin/companies/add")}>
                <Plus className="h-4 w-4 mr-2" /> Add Company
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminCompanies;
