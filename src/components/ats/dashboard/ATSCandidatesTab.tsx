
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Phone, MapPin } from 'lucide-react';

interface Candidate {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  current_title?: string;
  status?: string;
}

interface ATSCandidatesTabProps {
  candidates: Candidate[];
  searchTerm: string;
  onCreateCandidate: () => void;
  loading: boolean;
}

const ATSCandidatesTab = ({ candidates, searchTerm, onCreateCandidate, loading }: ATSCandidatesTabProps) => {
  const filteredCandidates = candidates.filter(candidate => 
    candidate.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Candidates</h3>
          <p className="text-sm text-muted-foreground">
            Manage your talent pipeline and candidate database
          </p>
        </div>
        <Button onClick={onCreateCandidate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No candidates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No candidates match your search criteria.' : 'Start building your talent pipeline.'}
              </p>
              <Button onClick={onCreateCandidate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Candidate
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {candidate.first_name} {candidate.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      {candidate.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {candidate.email}
                        </span>
                      )}
                      {candidate.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {candidate.phone}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {candidate.status || 'New'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {candidate.current_title && (
                      <div>{candidate.current_title}</div>
                    )}
                    {candidate.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSCandidatesTab;
