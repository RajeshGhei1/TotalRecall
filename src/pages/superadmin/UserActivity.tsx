
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UserActivityDashboard } from '@/components/superadmin/user-activity/UserActivityDashboard';

const UserActivity = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/dashboard">Super Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Activity</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">User Activity</h1>
          <p className="text-muted-foreground">
            Monitor user activity, sessions, and behavioral patterns
          </p>
        </div>

        <UserActivityDashboard />
      </div>
    </AdminLayout>
  );
};

export default UserActivity;
