
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Person } from '@/types/person';

interface PersonHeaderProps {
  person: Person;
  onEdit?: () => void;
}

const PersonHeader: React.FC<PersonHeaderProps> = ({ person, onEdit }) => {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{person.full_name}</h1>
        <p className="text-muted-foreground">
          {person.type === 'talent' ? 'Talent' : 'Business Contact'}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="outline" onClick={() => navigate('/superadmin/people')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
};

export default PersonHeader;
