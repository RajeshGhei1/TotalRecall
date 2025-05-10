
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Tenant {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  created_at: string;
}

interface TenantListProps {
  tenants: Tenant[];
  isLoading: boolean;
  onOpenUserManager: (tenant: Tenant) => void;
}

const TenantList = ({ tenants, isLoading, onOpenUserManager }: TenantListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant List</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">Loading...</div>
        ) : tenants.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            No tenants found. Click "Add Tenant" to create a new one.
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.domain}</TableCell>
                    <TableCell>
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenUserManager(tenant)}
                        className="ml-2"
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Manage Users
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantList;
