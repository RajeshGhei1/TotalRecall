
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Save, AlertCircle, Plus, Building, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const ReportingManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [pendingChanges, setPendingChanges] = useState<Record<string, string | null>>({});
  const queryClient = useQueryClient();

  // Fetch companies for filtering
  const { data: companies = [] } = useQuery({
    queryKey: ['companies-for-reporting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch properly linked contacts with company relationships
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts-for-reporting', companyFilter],
    queryFn: async () => {
      console.log('Fetching contacts for reporting...');
      
      let query = supabase
        .from('company_relationships')
        .select(`
          id,
          person_id,
          company_id,
          branch_office_id,
          role,
          reports_to,
          people!inner (
            id,
            full_name,
            email,
            type
          ),
          companies!inner (
            id,
            name
          ),
          company_branch_offices (
            id,
            branch_name,
            city
          )
        `)
        .eq('is_current', true)
        .eq('people.type', 'contact')
        .not('company_id', 'is', null);

      if (companyFilter !== 'all') {
        query = query.eq('company_id', companyFilter);
      }

      const { data: relationshipsData, error: relationshipsError } = await query.order('people.full_name');
        
      if (relationshipsError) {
        console.error('Error fetching relationships:', relationshipsError);
        throw relationshipsError;
      }

      console.log('Found relationships:', relationshipsData?.length || 0);
      return relationshipsData || [];
    },
  });

  const saveChangesMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(pendingChanges);
      console.log('Saving changes:', updates);

      for (const [relationshipId, managerId] of updates) {
        const { error } = await supabase
          .from('company_relationships')
          .update({ reports_to: managerId })
          .eq('id', relationshipId);
          
        if (error) throw error;
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

  const handleManagerChange = (relationshipId: string, managerId: string | null) => {
    setPendingChanges(prev => ({
      ...prev,
      [relationshipId]: managerId === '' ? null : managerId,
    }));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.people.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.people.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.companies.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasChanges = Object.keys(pendingChanges).length > 0;

  // Group contacts by company for better organization
  const contactsByCompany = filteredContacts.reduce((acc, contact) => {
    const companyId = contact.company_id;
    const companyName = contact.companies.name;
    
    if (!acc[companyId]) {
      acc[companyId] = {
        companyName,
        contacts: []
      };
    }
    
    acc[companyId].contacts.push(contact);
    return acc;
  }, {} as Record<string, { companyName: string; contacts: typeof filteredContacts }>);

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
            <h3 className="text-lg font-medium mb-2">No Linked Contacts Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to link contacts to companies first before setting up reporting relationships.
            </p>
            <Button onClick={() => window.location.href = '/superadmin/people'}>
              <Plus className="h-4 w-4 mr-2" />
              Link Contacts to Companies
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
            <Badge variant="secondary">{contacts.length} linked contacts</Badge>
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
        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              You have unsaved changes. Click "Save Changes" to apply them.
            </span>
          </div>
        )}

        {/* Contacts grouped by company */}
        <div className="space-y-6">
          {Object.entries(contactsByCompany).map(([companyId, { companyName, contacts: companyContacts }]) => (
            <div key={companyId} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Building className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-lg">{companyName}</h3>
                <Badge variant="outline">{companyContacts.length} contacts</Badge>
              </div>
              
              {companyContacts.map((contact) => {
                const currentManagerId = pendingChanges[contact.id] !== undefined 
                  ? pendingChanges[contact.id] 
                  : contact.reports_to;
                const hasChange = pendingChanges[contact.id] !== undefined;

                // Get potential managers from the same company, excluding the contact themselves
                const potentialManagers = companyContacts.filter(c => c.person_id !== contact.person_id);

                return (
                  <div key={contact.id} className={`p-4 border rounded-lg ${hasChange ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {contact.people.full_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{contact.people.full_name}</h4>
                            {hasChange && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                                Changed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{contact.people.email}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>Role: {contact.role}</span>
                            {contact.company_branch_offices && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{contact.company_branch_offices.branch_name}</span>
                                {contact.company_branch_offices.city && (
                                  <span>({contact.company_branch_offices.city})</span>
                                )}
                              </div>
                            )}
                          </div>
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
                            {potentialManagers.map((manager) => (
                              <SelectItem key={manager.person_id} value={manager.person_id}>
                                <div className="flex flex-col">
                                  <span>{manager.people.full_name}</span>
                                  <span className="text-xs text-muted-foreground">{manager.role}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
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
