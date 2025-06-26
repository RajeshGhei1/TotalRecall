
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Save, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const ReportingManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingChanges, setPendingChanges] = useState<Record<string, string | null>>({});
  const queryClient = useQueryClient();

  // Fetch all contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts-for-reporting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('people')
        .select(`
          id,
          full_name,
          email,
          company_relationships!inner(
            id,
            role,
            reports_to,
            is_current,
            companies(name)
          )
        `)
        .eq('type', 'contact')
        .eq('company_relationships.is_current', true)
        .order('full_name');
        
      if (error) throw error;
      return data || [];
    },
  });

  // Create a lookup map for easy manager selection
  const contactsMap = contacts.reduce((acc, contact) => {
    acc[contact.id] = contact;
    return acc;
  }, {} as Record<string, any>);

  const saveChangesMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(pendingChanges).map(([personId, managerId]) => ({
        person_id: personId,
        reports_to: managerId,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('company_relationships')
          .update({ reports_to: update.reports_to })
          .eq('person_id', update.person_id)
          .eq('is_current', true);
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts-for-reporting'] });
      queryClient.invalidateQueries({ queryKey: ['person-reporting-relationships'] });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Reporting Relationships Manager
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
            const currentRelationship = contact.company_relationships?.[0];
            const currentManagerId = pendingChanges[contact.id] !== undefined 
              ? pendingChanges[contact.id] 
              : currentRelationship?.reports_to;
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
                          <Badge variant="outline" className="text-xs">Changed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                      {currentRelationship?.role && (
                        <p className="text-xs text-muted-foreground">
                          {currentRelationship.role} at {currentRelationship.companies?.name}
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

        {filteredContacts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No contacts match your search.' : 'No contacts found.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportingManager;
