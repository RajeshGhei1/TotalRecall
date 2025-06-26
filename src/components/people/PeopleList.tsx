
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Mail,
  Phone,
  MapPin,
  Building
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePeople } from '@/hooks/usePeople';
import { QueryErrorDisplay } from '@/components/ui/error-display';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import PersonEditDialog from './personForm/PersonEditDialog';
import { Person } from '@/types/person';
import { useIsMobile } from '@/hooks/use-mobile';
import ReportingIndicator from './ReportingIndicator';

interface PeopleListProps {
  personType: 'talent' | 'contact';
  searchQuery?: string;
  companyFilter?: string;
  onLinkToCompany?: (personId: string) => void;
}

const PeopleList: React.FC<PeopleListProps> = ({ 
  personType, 
  searchQuery = '', 
  companyFilter = 'all',
  onLinkToCompany 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  
  const { 
    people, 
    isLoading, 
    isError, 
    error,
    deletePerson 
  } = usePeople(personType, searchQuery, companyFilter, 'superadmin');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <QueryErrorDisplay
        error={error}
        onRetry={() => window.location.reload()}
        entityName={`${personType}s`}
      />
    );
  }

  const handleViewProfile = (person: Person) => {
    navigate(`/superadmin/people/${person.id}`);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
  };

  const handleDeletePerson = async (person: Person) => {
    if (window.confirm(`Are you sure you want to delete ${person.full_name}?`)) {
      try {
        await deletePerson.mutateAsync(person.id);
      } catch (error) {
        console.error('Error deleting person:', error);
      }
    }
  };

  const filteredPeople = people.filter(person => {
    const matchesSearch = !searchQuery || 
      person.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Company filter logic would go here if needed
    return matchesSearch;
  });

  if (filteredPeople.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">
              No {personType === 'talent' ? 'talent' : 'contacts'} found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No ${personType === 'talent' ? 'talent' : 'contacts'} match your search criteria.`
                : `You haven't added any ${personType === 'talent' ? 'talent' : 'contacts'} yet.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>
              {personType === 'talent' ? 'Talent' : 'Business Contacts'} 
              <Badge variant="secondary" className="ml-2">
                {filteredPeople.length}
              </Badge>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {person.full_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm md:text-base truncate">
                        {person.full_name}
                      </h4>
                      <Badge variant={person.type === 'talent' ? 'default' : 'secondary'}>
                        {person.type === 'talent' ? 'Talent' : 'Contact'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate">{person.email}</span>
                      </div>
                      
                      {person.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{person.phone}</span>
                        </div>
                      )}
                      
                      {person.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{person.location}</span>
                        </div>
                      )}
                      
                      {person.current_company && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building className="h-3 w-3 mr-1" />
                          <span>{person.current_company.name} - {person.current_company.role}</span>
                        </div>
                      )}

                      {/* Show reporting relationships for contacts */}
                      {person.type === 'contact' && (
                        <ReportingIndicator personId={person.id} showDetails={!isMobile} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(person)}
                  >
                    <Eye className="h-4 w-4" />
                    {!isMobile && <span className="ml-1">View</span>}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProfile(person)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditPerson(person)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {onLinkToCompany && (
                        <DropdownMenuItem onClick={() => onLinkToCompany(person.id)}>
                          <Building className="mr-2 h-4 w-4" />
                          Link to Company
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeletePerson(person)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingPerson && (
        <PersonEditDialog
          isOpen={!!editingPerson}
          onClose={() => setEditingPerson(null)}
          person={editingPerson}
          onSuccess={() => setEditingPerson(null)}
        />
      )}
    </>
  );
};

export default PeopleList;
