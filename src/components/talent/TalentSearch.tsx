
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

interface TalentSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAddTalent: () => void;
}

const TalentSearch: React.FC<TalentSearchProps> = ({ 
  searchTerm, 
  setSearchTerm,
  onAddTalent
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search talents..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddTalent}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Talent
      </Button>
    </div>
  );
};

export default TalentSearch;
