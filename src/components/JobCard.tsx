
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Briefcase, DollarSign } from "lucide-react";

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  posted: string;
  logo: string;
  featured?: boolean;
}

const JobCard = ({ 
  title, 
  company, 
  location, 
  type, 
  salary, 
  description, 
  posted,
  logo,
  featured 
}: JobCardProps) => {
  return (
    <Card className={`card-hover ${featured ? 'border-l-4 border-l-jobmojo-primary' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={logo} 
              alt={`${company} logo`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg">{title}</h3>
              {featured && (
                <Badge className="bg-jobmojo-primary">Featured</Badge>
              )}
            </div>
            
            <div className="mt-1 text-gray-700">
              {company}
            </div>
            
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-gray-500" />
                <span>{type}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                <span>{salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span>{posted}</span>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-600 line-clamp-2">
              {description}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
