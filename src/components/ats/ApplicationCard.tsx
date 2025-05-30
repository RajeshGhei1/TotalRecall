
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  Star,
  ArrowRight,
  MessageSquare,
  Phone,
  Video
} from 'lucide-react';
import { Application } from '@/types/ats';

interface ApplicationCardProps {
  application: Application;
  compact?: boolean;
}

const ApplicationCard = ({ application, compact = false }: ApplicationCardProps) => {
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const candidate = application.candidate;
  const job = application.job;
  
  if (!candidate || !job) return null;

  const initials = `${candidate.first_name[0]}${candidate.last_name[0]}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className={compact ? "pb-3" : "pb-4"}>
        <div className="flex items-start gap-3">
          <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {candidate.first_name} {candidate.last_name}
              </h3>
              <Badge className={`ml-2 ${getStatusColor(application.status)}`}>
                {application.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span className={`text-muted-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {job.title}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className={`text-muted-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {job.department}
              </span>
            </div>
            
            <div className={`flex items-center gap-4 mt-2 ${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
              </div>
              {candidate.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{candidate.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="space-y-4">
          {/* AI Match Score */}
          {application.ai_match_score && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">AI Match Score</span>
                </div>
                <span className={`text-sm font-semibold ${getMatchScoreColor(application.ai_match_score)}`}>
                  {application.ai_match_score}%
                </span>
              </div>
              <Progress value={application.ai_match_score} className="h-2" />
              {application.ai_match_reasons.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Key matches: {application.ai_match_reasons.slice(0, 2).join(', ')}
                  {application.ai_match_reasons.length > 2 && '...'}
                </div>
              )}
            </div>
          )}

          {/* Candidate Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Experience:</span>
              <span className="ml-1 font-medium">
                {candidate.experience_years ? `${candidate.experience_years} years` : 'Not specified'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Current Role:</span>
              <span className="ml-1 font-medium">
                {candidate.current_title || 'Not specified'}
              </span>
            </div>
          </div>

          {/* Skills Match */}
          {candidate.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {application.recruiter_notes && (
            <div className="p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium mb-1">Recruiter Notes</h4>
              <p className="text-sm text-muted-foreground">{application.recruiter_notes}</p>
            </div>
          )}

          {/* Next Action */}
          {application.next_action && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
              <div>
                <h4 className="text-sm font-medium text-blue-900">Next Action</h4>
                <p className="text-sm text-blue-700">{application.next_action}</p>
              </div>
              {application.next_action_date && (
                <Badge variant="outline" className="text-xs">
                  {new Date(application.next_action_date).toLocaleDateString()}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              View Details
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-3 w-3 mr-1" />
              Interview
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-3 w-3 mr-1" />
              Note
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ApplicationCard;
