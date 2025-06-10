
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, History, Network, TrendingUp } from 'lucide-react';
import { useCompanyRelationshipsAdvanced, useCompanyRelationshipMutations } from '@/hooks/useCompanyRelationships';
import CreateRelationshipDialog from './CreateRelationshipDialog';
import RelationshipTimeline from './RelationshipTimeline';
import CompanyNetworkChart from './CompanyNetworkChart';
import { CompanyRelationshipAdvanced } from '@/types/company-relationships';
import { format } from 'date-fns';

interface RelationshipManagerProps {
  companyId: string;
  companyName: string;
}

const RelationshipManager: React.FC<RelationshipManagerProps> = ({ companyId, companyName }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<CompanyRelationshipAdvanced | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  const { data: relationships = [], isLoading } = useCompanyRelationshipsAdvanced(companyId);
  const { deleteRelationship } = useCompanyRelationshipMutations();

  const handleDeleteRelationship = (relationship: CompanyRelationshipAdvanced) => {
    if (confirm(`Are you sure you want to delete the ${relationship.relationship_type?.name} relationship between ${relationship.parent_company?.name} and ${relationship.child_company?.name}?`)) {
      deleteRelationship.mutate(relationship.id);
    }
  };

  const getRelationshipBadgeColor = (relationshipType: string) => {
    const colors: Record<string, string> = {
      'Subsidiary': 'bg-green-100 text-green-800',
      'Parent Company': 'bg-blue-100 text-blue-800',
      'Partnership': 'bg-purple-100 text-purple-800',
      'Joint Venture': 'bg-yellow-100 text-yellow-800',
      'Acquisition': 'bg-red-100 text-red-800',
      'Merger': 'bg-pink-100 text-pink-800',
      'Strategic Alliance': 'bg-cyan-100 text-cyan-800',
      'Supplier': 'bg-lime-100 text-lime-800',
      'Customer': 'bg-orange-100 text-orange-800',
    };
    return colors[relationshipType] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Company Relationships - {companyName}</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Relationship
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="list">Relationships</TabsTrigger>
              <TabsTrigger value="network">
                <Network className="h-4 w-4 mr-1" />
                Network
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <History className="h-4 w-4 mr-1" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="h-4 w-4 mr-1" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              {relationships.length === 0 ? (
                <div className="text-center py-8">
                  <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No relationships found</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Relationship
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {relationships.map((relationship) => (
                    <div
                      key={relationship.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getRelationshipBadgeColor(relationship.relationship_type?.name || '')}>
                              {relationship.relationship_type?.name}
                            </Badge>
                            {relationship.ownership_percentage && (
                              <Badge variant="outline">
                                {relationship.ownership_percentage}% ownership
                              </Badge>
                            )}
                            {!relationship.is_active && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">{relationship.parent_company?.name}</span>
                            <span className="text-gray-500 mx-2">→</span>
                            <span className="font-medium">{relationship.child_company?.name}</span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <span>Effective: {format(new Date(relationship.effective_date), 'MMM dd, yyyy')}</span>
                            {relationship.end_date && (
                              <span className="ml-4">Ended: {format(new Date(relationship.end_date), 'MMM dd, yyyy')}</span>
                            )}
                          </div>
                          
                          {relationship.notes && (
                            <div className="text-sm text-gray-600 mt-2">
                              {relationship.notes}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRelationship(relationship)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRelationship(relationship)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="network" className="mt-6">
              <CompanyNetworkChart companyId={companyId} height="600px" />
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <RelationshipTimeline companyId={companyId} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{relationships.length}</div>
                    <div className="text-sm text-gray-500">Total Relationships</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {relationships.filter(r => r.relationship_type?.is_hierarchical).length}
                    </div>
                    <div className="text-sm text-gray-500">Hierarchical</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {relationships.filter(r => r.ownership_percentage && r.ownership_percentage > 0).length}
                    </div>
                    <div className="text-sm text-gray-500">With Ownership</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Advanced analytics dashboard coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateRelationshipDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        companyId={companyId}
        relationship={selectedRelationship}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          setSelectedRelationship(null);
        }}
      />
    </div>
  );
};

export default RelationshipManager;
