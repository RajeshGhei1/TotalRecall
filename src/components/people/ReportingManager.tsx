
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Save, AlertCircle, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const ReportingManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingChanges, setPendingChanges] = useState<Record<string, string | null>>({});
  const queryClient = useQueryClient();

  // Fetch all contacts - simplified query
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts-for-reporting'],
    queryFn: async () => {
      console.log('Fetching contacts for reporting...');
      
      // First, get all contacts
      const { data: peopleData, error: peopleError } = await supabase
        .from('people')
        .select('id, full_name, email')
        .eq('type', 'contact')
        .order('full_name');
        
      if (peopleError) {
        console.error('Error fetching people:', peopleError);
        throw peopleError;
      }

      console.log('Found people:', peopleData?.length || 0);

      if (!peopleData || peopleData.length === 0) {
        return [];
      }

      // Then get their current relationships
      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from('company_relationships')
        .select('person_id, role, reports_to')
        .eq('is_current', true)
        .in('person_id', peopleData.map(p => p.id));
        
      if (relationshipsError) {
        console.error('Error fetching relationships:', relationshipsError);
        // Don't throw error, just continue without relationships
      }

      console.log('Found relationships:', relationshipsData?.length || 0);

      // Combine the data
      const contactsWithRelationships = peopleData.map(person => ({
        ...person,
        relationship: relationshipsData?.find(r => r.person_id === person.id) || null
      }));

      console.log('Final contacts with relationships:', contactsWithRelationships);
      return contactsWithRelationships;
    },
  });

  const saveChangesMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(pendingChanges);
      console.log('Saving changes:', updates);

      for (const [personId, managerId] of updates) {
        // Check if person has a current relationship
        const { data: currentRelationship } = await supabase
          .from('company_relationships')
          .select('id')
          .eq('person_id', personId)
          .eq('is_current', true)
          .maybeSingle();

        if (currentRelationship) {
          // Update existing relationship
          const { error } = await supabase
            .from('company_relationships')
            .update({ reports_to: managerId })
            .eq('id', currentRelationship.id);
            
          if (error) throw error;
        } else {
          // Create new relationship - we need to provide a company_id
          // For reporting purposes, we'll use a default/placeholder company ID
          // In a real scenario, you might want to let users select a company
          const { error } = await supabase
            .from('company_relationships')
            .insert({
              person_id: personId,
              company_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
              relationship_type: 'business_contact',
              role: 'Contact',
              reports_to: managerId,
              start_date: new Date().toISOString().split('T')[0],
              is_current: true,
            });
            
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts-for-reporting'] });
      queryClient.invalidateQueries({ queryKey: ['reporting-indicator'] });
      setPendingChanges({});
      toast.success('Reporting relationships updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating reporting relationships:', error);
      toast.error('Failed to update reporting relationships');
    }
  });

  const handleManagerChange = (personId: string, managerId: string | null) => {
    setPendingChanges(prev => ({
      ...prev,
      [personId]: managerId === '' ? null : managerId,
    }));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasChanges = Object.keys(pendingChanges).length > 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporting Relationships Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 border rounded">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[200px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporting Relationships Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Contacts</h3>
            <p className="text-muted-foreground mb-4">
              {error.message || 'Failed to load contacts'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporting Relationships Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Contacts Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to add contacts first before setting up reporting relationships.
            </p>
            <Button onClick={() => window.location.href = '/superadmin/people'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contacts
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Reporting Relationships Manager
            <Badge variant="secondary">{contacts.length} contacts</Badge>
          </div>
          {hasChanges && (
            <Button 
              onClick={() => saveChangesMutation.mutate()}
              disabled={saveChangesMutation.isPending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes ({Object.keys(pendingChanges).length})
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              You have unsaved changes. Click "Save Changes" to apply them.
            </span>
          </div>
        )}

        {/* Contacts List */}
        <div className="space-y-3">
          {filteredContacts.map((contact) => {
            const currentManagerId = pendingChanges[contact.id] !== undefined 
              ? pendingChanges[contact.id] 
              : contact.relationship?.reports_to;
            const hasChange = pendingChanges[contact.id] !== undefined;

            return (
              <div key={contact.id} className={`p-4 border rounded-lg ${hasChange ? 'bg-blue-50 border-blue-200' : ''}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contact.full_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{contact.full_name}</h4>
                        {hasChange && (
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                            Changed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                      {contact.relationship?.role && (
                        <p className="text-xs text-muted-foreground">
                          Role: {contact.relationship.role}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-64">
                    <Select
                      value={currentManagerId || ''}
                      onValueChange={(value) => handleManagerChange(contact.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No manager</SelectItem>
                        {contacts
                          .filter(c => c.id !== contact.id) // Don't allow self-reporting
                          .map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.full_name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredContacts.length === 0 && searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            No contacts match your search for "{searchQuery}".
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportingManager;
