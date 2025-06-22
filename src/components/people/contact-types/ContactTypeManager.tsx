
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users, Building, ShoppingCart, Truck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import ContactTypeForm from './ContactTypeForm';

interface ContactType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

const ContactTypeManager: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<ContactType | null>(null);
  const queryClient = useQueryClient();

  const { data: contactTypes = [], isLoading } = useQuery({
    queryKey: ['contact-types'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('contact_types')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching contact types:', error);
          throw error;
        }
        return data as ContactType[];
      } catch (error) {
        console.error('Failed to fetch contact types:', error);
        // Return default contact types if the table doesn't exist or there's an error
        return [
          { id: '1', name: 'Client', description: 'Business clients and customers', icon: 'users', color: '#10B981', is_default: true, created_at: new Date().toISOString() },
          { id: '2', name: 'Vendor', description: 'Service providers and suppliers', icon: 'truck', color: '#F59E0B', is_default: false, created_at: new Date().toISOString() },
          { id: '3', name: 'Partner', description: 'Business partners and collaborators', icon: 'building', color: '#3B82F6', is_default: false, created_at: new Date().toISOString() },
          { id: '4', name: 'Lead', description: 'Potential customers and prospects', icon: 'shopping-cart', color: '#8B5CF6', is_default: false, created_at: new Date().toISOString() }
        ];
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-types'] });
      toast({ title: 'Contact type deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting contact type',
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      users: Users,
      building: Building,
      'shopping-cart': ShoppingCart,
      truck: Truck,
    };
    return icons[iconName] || Users;
  };

  const handleEdit = (type: ContactType) => {
    setEditingType(type);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact type?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingType(null);
  };

  if (isLoading) {
    return <div>Loading contact types...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contact Types</h3>
          <p className="text-sm text-muted-foreground">
            Manage different categories of business contacts
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactTypes.map((type) => {
          const IconComponent = getIcon(type.icon);
          return (
            <Card key={type.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: type.color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{type.name}</CardTitle>
                  </div>
                  {type.is_default && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {type.description}
                </CardDescription>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(type)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {!type.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ContactTypeForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        editingType={editingType}
      />
    </div>
  );
};

export default ContactTypeManager;
