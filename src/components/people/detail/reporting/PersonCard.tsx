
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PersonCardProps {
  id: string;
  fullName: string;
  email?: string | null;
  role?: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ 
  id, 
  fullName, 
  email, 
  role 
}) => {
  const navigate = useNavigate();
  
  const handleViewPerson = () => {
    navigate(`/superadmin/people/${id}`);
  };
  
  return (
    <div className="border rounded-md p-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-blue-100">
          <User size={16} className="text-blue-600" />
        </div>
        <div>
          <div className="font-medium">{fullName}</div>
          {role && <div className="text-xs">{role}</div>}
          {email && (
            <div className="text-xs text-muted-foreground">{email}</div>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleViewPerson}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default PersonCard;
