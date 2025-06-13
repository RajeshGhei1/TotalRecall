
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useTenants } from '@/hooks/useTenants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Tenants: React.FC = () => {
  const { tenants, isLoading, createTenant, updateTenant } = useTenants();

  const handleCreateTenant = async () => {
    try {
      await createTenant.mutateAsync({
        name: 'New Tenant',
        description: 'A new tenant'
      });
    } catch (error) {
      console.error('Failed to create tenant:', error);
    }
  };

  const handleUpdateTenant = async (id: string) => {
    try {
      await updateTenant.mutateAsync({
        id,
        updates: {
          name: 'Updated Tenant Name'
        }
      });
    } catch (error) {
      console.error('Failed to update tenant:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tenants</h1>
          <Button onClick={handleCreateTenant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </div>

        <div className="grid gap-4">
          {tenants?.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <CardTitle>{tenant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tenant.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateTenant(tenant.id)}
                  className="mt-2"
                >
                  Update
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Tenants;
