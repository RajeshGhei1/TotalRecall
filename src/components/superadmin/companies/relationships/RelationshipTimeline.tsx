
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Building, TrendingUp, TrendingDown } from 'lucide-react';
import { useCompanyRelationshipsAdvanced } from '@/hooks/useCompanyRelationships';
import { format, formatDistanceToNow } from 'date-fns';

interface RelationshipTimelineProps {
  companyId: string;
}

const RelationshipTimeline: React.FC<RelationshipTimelineProps> = ({ companyId }) => {
  const { data: relationships = [], isLoading } = useCompanyRelationshipsAdvanced(companyId);

  // Sort relationships by effective date (newest first)
  const sortedRelationships = [...relationships].sort(
    (a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relationship Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sortedRelationships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relationship Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No relationship history available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEventIcon = (relationship: any) => {
    if (!relationship.is_active && relationship.end_date) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  };

  const getEventType = (relationship: any) => {
    if (!relationship.is_active && relationship.end_date) {
      return 'Relationship Ended';
    }
    return 'Relationship Started';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relationship Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedRelationships.map((relationship, index) => (
            <div key={relationship.id} className="relative">
              {/* Timeline line */}
              {index < sortedRelationships.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                  {getEventIcon(relationship)}
                </div>
                
                {/* Event content */}
                <div className="flex-grow min-w-0">
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getRelationshipBadgeColor(relationship.relationship_type?.name || '')}>
                            {relationship.relationship_type?.name}
                          </Badge>
                          {relationship.ownership_percentage && (
                            <Badge variant="outline">
                              {relationship.ownership_percentage}% ownership
                            </Badge>
                          )}
                          <Badge variant={relationship.is_active ? 'default' : 'secondary'}>
                            {relationship.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {getEventType(relationship)}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">{relationship.parent_company?.name}</span>
                            <span className="mx-2">→</span>
                            <span className="font-medium">{relationship.child_company?.name}</span>
                          </div>
                        </div>
                        
                        {relationship.notes && (
                          <div className="text-sm text-gray-600 mt-2">
                            {relationship.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 ml-4">
                        <Building className="h-3 w-3" />
                        <span>{format(new Date(relationship.effective_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-400">
                      {formatDistanceToNow(new Date(relationship.effective_date), { addSuffix: true })}
                      {relationship.end_date && (
                        <span className="ml-2">
                          • Ended {format(new Date(relationship.end_date), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Timeline end marker */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div className="text-sm text-gray-500">
            Company established or first tracked relationship
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipTimeline;
