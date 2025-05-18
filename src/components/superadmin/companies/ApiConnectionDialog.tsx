
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader, Database } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface ApiConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiConnectionDialog: React.FC<ApiConnectionDialogProps> = ({ isOpen, onClose }) => {
  const [sourceType, setSourceType] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = () => {
    if (!sourceType) {
      toast({
        title: "Source Required",
        description: "Please select a data source type.",
        variant: "destructive"
      });
      return;
    }
    
    if (!apiKey || !apiEndpoint) {
      toast({
        title: "Missing Information",
        description: "API key and endpoint are required to establish connection.",
        variant: "destructive"
      });
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${sourceType} API.`
      });
      onClose();
    }, 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to External Data Source</DialogTitle>
          <DialogDescription>
            Import company data from external databases or APIs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="source-type">Data Source</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger id="source-type">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crunchbase">Crunchbase</SelectItem>
                <SelectItem value="clearbit">Clearbit</SelectItem>
                <SelectItem value="linkedin">LinkedIn Sales Navigator</SelectItem>
                <SelectItem value="salesforce">Salesforce</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input 
              id="api-key" 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-endpoint">API Endpoint</Label>
            <Input 
              id="api-endpoint" 
              type="text" 
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.example.com/v1/companies"
            />
          </div>
          
          {sourceType && (
            <div className="rounded-md bg-muted p-4">
              <h4 className="font-medium mb-2">Connection Details</h4>
              <p className="text-sm text-muted-foreground">
                {sourceType === 'crunchbase' && 'Connect to Crunchbase to import company information, funding rounds, and acquisitions.'}
                {sourceType === 'clearbit' && 'Connect to Clearbit to enrich company data with additional details and insights.'}
                {sourceType === 'linkedin' && 'Import company details from LinkedIn Sales Navigator.'}
                {sourceType === 'salesforce' && 'Sync companies from your Salesforce CRM instance.'}
                {sourceType === 'custom' && 'Connect to a custom API endpoint that returns company data in JSON format.'}
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isConnecting}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleConnect} 
            disabled={!sourceType || !apiKey || !apiEndpoint || isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Connect
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiConnectionDialog;
