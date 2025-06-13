
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Building, Users, User, PersonStanding } from 'lucide-react';
import { useSearchByTrId } from '@/hooks/useCompanies';
import { toast } from 'sonner';

interface TrIdSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  entity_type: string;
  entity_id: string;
  entity_name: string;
  tr_id: string;
}

const TrIdSearchDialog: React.FC<TrIdSearchDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchMutation = useSearchByTrId();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a TR ID to search');
      return;
    }

    try {
      const results = await searchMutation.mutateAsync(searchTerm.trim());
      setSearchResults(results || []);
      
      if (!results || results.length === 0) {
        toast.info('No entities found with this TR ID');
      } else {
        toast.success(`Found ${results.length} entity(ies)`);
      }
    } catch (error) {
      toast.error('Failed to search for TR ID');
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'company':
        return <Building className="h-5 w-5" />;
      case 'tenant':
        return <Users className="h-5 w-5" />;
      case 'user':
        return <User className="h-5 w-5" />;
      case 'person':
        return <PersonStanding className="h-5 w-5" />;
      default:
        return <Search className="h-5 w-5" />;
    }
  };

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'company':
        return 'bg-blue-100 text-blue-800';
      case 'tenant':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-purple-100 text-purple-800';
      case 'person':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search by TR ID</DialogTitle>
          <DialogDescription>
            Search for companies, tenants, users, or business contacts using their Total Recall ID.
            Format: TR-{'{TYPE}'}-{'{NUMBER}'} (e.g., TR-COM-01000001)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="tr-id-search">TR ID</Label>
              <Input
                id="tr-id-search"
                placeholder="Enter TR ID (e.g., TR-COM-01000001)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={searchMutation.isPending}
                className="px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Search Results</h3>
              {searchResults.map((result) => (
                <Card key={`${result.entity_type}-${result.entity_id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getEntityIcon(result.entity_type)}
                          <Badge className={getEntityColor(result.entity_type)}>
                            {result.entity_type.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-semibold">{result.entity_name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {result.entity_id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold text-blue-600">
                          {result.tr_id}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchMutation.isPending && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrIdSearchDialog;
