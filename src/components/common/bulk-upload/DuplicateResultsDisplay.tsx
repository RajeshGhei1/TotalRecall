
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DuplicateInfo, ProcessingResultsEnhanced } from './types';

interface DuplicateResultsDisplayProps {
  results: ProcessingResultsEnhanced;
}

const DuplicateResultsDisplay: React.FC<DuplicateResultsDisplayProps> = ({ results }) => {
  const [expandedDuplicates, setExpandedDuplicates] = useState<Set<number>>(new Set());

  const toggleDuplicate = (index: number) => {
    const newExpanded = new Set(expandedDuplicates);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDuplicates(newExpanded);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'skip': return <XCircle className="h-4 w-4 text-yellow-500" />;
      case 'merge': return <Users className="h-4 w-4 text-blue-500" />;
      case 'update': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'create_anyway': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'skip': return 'Skipped';
      case 'merge': return 'Merged';
      case 'update': return 'Updated';
      case 'create_anyway': return 'Created Anyway';
      case 'review': return 'Needs Review';
      default: return action;
    }
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-red-100 text-red-800';
      case 'phone': return 'bg-blue-100 text-blue-800';
      case 'name_company': return 'bg-green-100 text-green-800';
      case 'linkedin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (results.duplicate_details.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Duplicate Detection Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{results.duplicates_found}</div>
            <div className="text-sm text-muted-foreground">Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{results.duplicates_skipped}</div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{results.duplicates_merged}</div>
            <div className="text-sm text-muted-foreground">Merged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{results.successful}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Duplicate Details:</h4>
          {results.duplicate_details.map((duplicate, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto"
                  onClick={() => toggleDuplicate(index)}
                >
                  <div className="flex items-center gap-3">
                    {expandedDuplicates.has(index) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="font-medium">Row {duplicate.row}: {duplicate.newRecord.full_name}</span>
                    <div className="flex gap-1">
                      {duplicate.matches.map((match, matchIndex) => (
                        <Badge key={matchIndex} className={getMatchTypeColor(match.type)}>
                          {match.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getActionIcon(duplicate.suggestedAction)}
                    <span className="text-sm">{getActionLabel(duplicate.suggestedAction)}</span>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-sm mb-2">New Record</h5>
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {duplicate.newRecord.full_name}</div>
                      <div><strong>Email:</strong> {duplicate.newRecord.email}</div>
                      <div><strong>Phone:</strong> {duplicate.newRecord.phone || 'N/A'}</div>
                      <div><strong>Company:</strong> {duplicate.newRecord.company_name || 'N/A'}</div>
                      <div><strong>LinkedIn:</strong> {duplicate.newRecord.linkedin_url || 'N/A'}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Existing Record</h5>
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {duplicate.existingRecord.full_name}</div>
                      <div><strong>Email:</strong> {duplicate.existingRecord.email}</div>
                      <div><strong>Phone:</strong> {duplicate.existingRecord.phone || 'N/A'}</div>
                      <div><strong>Company:</strong> {duplicate.existingRecord.current_title || 'N/A'}</div>
                      <div><strong>LinkedIn:</strong> {duplicate.existingRecord.linkedin_url || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <h5 className="font-medium text-sm mb-2">Match Details</h5>
                    <div className="flex gap-2 flex-wrap">
                      {duplicate.matches.map((match, matchIndex) => (
                        <Badge key={matchIndex} className={getMatchTypeColor(match.type)}>
                          {match.type}: {Math.round(match.confidence * 100)}% confidence
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DuplicateResultsDisplay;
