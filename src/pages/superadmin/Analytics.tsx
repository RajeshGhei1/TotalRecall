
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";
import AnalyticsDashboard from "@/components/reporting/AnalyticsDashboard";

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Business intelligence and operational analytics for enterprise management
            </p>
          </div>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  );
};

export default Analytics;
