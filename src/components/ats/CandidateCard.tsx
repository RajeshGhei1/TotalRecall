
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  ExternalLink,
  Star,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Candidate } from '@/types/ats';

interface CandidateCardProps {
  candidate: Candidate;
  compact?: boolean;
}

const CandidateCard = ({ candidate, compact = false }: CandidateCardProps) => {
  const initials = `${candidate.first_name[0]}${candidate.last_name[0]}`;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className={compact ? "pb-3" : "pb-4"}>
        <div className="flex items-start gap-3">
          <Avatar className={compact ? "h-10 w-10" : "h-12 w-12"}>
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {candidate.first_name} {candidate.last_name}
            </h3>
            {candidate.current_title && (
              <p className={`text-muted-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {candidate.current_title}
                {candidate.current_company && ` at ${candidate.current_company}`}
              </p>
            )}
            
            <div className={`flex items-center gap-4 mt-2 ${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              {candidate.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{candidate.location}</span>
                </div>
              )}
              {candidate.experience_years && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>{candidate.experience_years}y exp</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="space-y-4">
          {/* Contact Info */}
          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Mail className="h-3 w-3 mr-1" />
              {candidate.email}
            </Button>
            {candidate.phone && (
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Phone className="h-3 w-3 mr-1" />
                {candidate.phone}
              </Button>
            )}
            {candidate.linkedin_url && (
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Linkedin className="h-3 w-3 mr-1" />
                LinkedIn
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 6).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {candidate.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.tags.map((tag, index) => (
                  <Badge key={index} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            {candidate.desired_salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>${candidate.desired_salary.toLocaleString()}</span>
              </div>
            )}
            {candidate.availability_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Available {new Date(candidate.availability_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* AI Summary */}
          {candidate.ai_summary && (
            <div className="p-3 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-1">AI Summary</h4>
              <p className="text-sm text-blue-700">{candidate.ai_summary}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              View Profile
            </Button>
            <Button variant="outline" size="sm">
              Match Jobs
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CandidateCard;
