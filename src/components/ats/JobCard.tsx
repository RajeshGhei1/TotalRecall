
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Clock,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { Job } from '@/types/ats';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

const JobCard = ({ job, compact = false }: JobCardProps) => {
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Job['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className={compact ? "pb-3" : "pb-4"}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <h3 className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {job.title}
              </h3>
              <Badge className={`text-xs ${getPriorityColor(job.priority)}`}>
                {job.priority}
              </Badge>
            </div>
            
            {job.department && (
              <p className={`text-muted-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {job.department}
              </p>
            )}
            
            <div className={`flex items-center gap-4 mt-2 ${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{job.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{job.employment_type}</span>
              </div>
            </div>
          </div>
          
          <Badge className={`ml-2 ${getStatusColor(job.status)}`}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="space-y-4">
          {/* Salary Range */}
          {(job.salary_min || job.salary_max) && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                {job.salary_min && job.salary_max 
                  ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                  : job.salary_min 
                    ? `From $${job.salary_min.toLocaleString()}`
                    : `Up to $${job.salary_max?.toLocaleString()}`
                }
              </span>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {job.description}
            </p>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Requirements</h4>
              <div className="flex flex-wrap gap-1">
                {job.requirements.slice(0, 4).map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
                {job.requirements.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.requirements.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
            {job.closes_at && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Closes {new Date(job.closes_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              View Applications
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-3 w-3 mr-1" />
              Match Candidates
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default JobCard;
