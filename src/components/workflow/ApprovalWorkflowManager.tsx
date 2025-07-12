
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedVersionControl } from '@/hooks/versioning/useEnhancedVersionControl';
import { CheckCircle, XCircle, Clock, Send, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApprovalWorkflowManagerProps {
  entityType: 'form' | 'report';
  entityId?: string;
}

const ApprovalWorkflowManager: React.FC<ApprovalWorkflowManagerProps> = ({
  entityType,
  entityId,
}) => {
  const {
    usePendingApprovals,
    reviewApproval,
    requestApproval,
  } = useEnhancedVersionControl();

  const { data: pendingApprovals, isLoading } = usePendingApprovals(entityType);
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'withdrawn': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleApprove = async (approvalId: string, shouldPublish: boolean = true) => {
    try {
      await reviewApproval.mutateAsync({
        approvalId,
        action: 'approve',
        notes: reviewNotes,
        shouldPublish,
      });
      setReviewNotes('');
      setSelectedApproval(null);
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      await reviewApproval.mutateAsync({
        approvalId,
        action: 'reject',
        notes: reviewNotes,
      });
      setReviewNotes('');
      setSelectedApproval(null);
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <CardTitle>Approval Workflow</CardTitle>
        <CardDescription>
          Review and approve pending {entityType} versions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {pendingApprovals?.map((approval) => (
              <div
                key={approval.id}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedApproval === approval.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(approval.status)}
                      <Badge className={getStatusColor(approval.status)}>
                        {approval.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Version {(approval as unknown).entity_versions?.version_number}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">
                      {(approval as unknown).entity_versions?.change_summary || `${entityType} approval request`}
                    </h4>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      Requested by {(approval as unknown).profiles?.full_name || (approval as unknown).profiles?.email}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(approval.requested_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                {approval.status === 'pending' && (
                  <div className="space-y-3">
                    {selectedApproval === approval.id && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Add review notes (optional)..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="min-h-[80px]"
                        />
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(approval.id, true)}
                            disabled={reviewApproval.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve & Publish
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(approval.id, false)}
                            disabled={reviewApproval.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve Only
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(approval.id)}
                            disabled={reviewApproval.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedApproval(null);
                              setReviewNotes('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedApproval !== approval.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApproval(approval.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                )}

                {approval.review_notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Review Notes:</div>
                    <div className="text-sm text-gray-600">{approval.review_notes}</div>
                  </div>
                )}
              </div>
            ))}
            
            {(!pendingApprovals || pendingApprovals.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending approvals</p>
                <p className="text-sm">New approval requests will appear here</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ApprovalWorkflowManager;
