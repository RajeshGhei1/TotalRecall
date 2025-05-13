
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Video, Phone } from "lucide-react";
import TenantSelector from "./TenantSelector";

const CommunicationSettings = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [emailTracking, setEmailTracking] = useState(false);

  const handleConnectClick = (platform: string) => {
    if (!selectedTenantId) {
      toast({
        title: "No tenant selected",
        description: "Please select a tenant first",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `Connect ${platform}`,
      description: `Integration flow for ${platform} would start here`,
    });
  };

  const handleSaveSettings = () => {
    if (!selectedTenantId) {
      toast({
        title: "No tenant selected",
        description: "Please select a tenant first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Communication settings saved",
      description: "Communication preferences have been updated",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Tools</CardTitle>
        <CardDescription>
          Configure communication channels and integrations for tenants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TenantSelector 
          selectedTenantId={selectedTenantId}
          onTenantChange={(tenantId) => setSelectedTenantId(tenantId)}
        />

        {!selectedTenantId ? (
          <div className="bg-muted/50 p-6 text-center rounded-md">
            <p className="text-muted-foreground">Select a tenant to manage its communication settings</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-md font-medium">Messaging Platforms</h3>
              
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <img
                      src="https://cdn.cdnlogo.com/logos/s/40/slack-new.svg"
                      alt="Slack"
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-sm text-muted-foreground">
                      Team communication and notifications
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleConnectClick("Slack")}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <img
                      src="https://cdn.cdnlogo.com/logos/m/25/microsoft-teams.svg"
                      alt="Teams"
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Microsoft Teams</p>
                    <p className="text-sm text-muted-foreground">
                      Chat, meetings, and collaboration
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleConnectClick("Microsoft Teams")}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <img
                      src="https://cdn.cdnlogo.com/logos/w/43/whatsapp.svg"
                      alt="WhatsApp"
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      Messaging with candidates and clients
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleConnectClick("WhatsApp")}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">SMS</p>
                    <p className="text-sm text-muted-foreground">
                      Text message campaigns and notifications
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleConnectClick("SMS")}>Connect</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Video Conferencing</h3>
              
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <img
                      src="https://cdn.cdnlogo.com/logos/z/41/zoom-app.svg"
                      alt="Zoom"
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Zoom</p>
                    <p className="text-sm text-muted-foreground">
                      Video interviews and team meetings
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleConnectClick("Zoom")}>Connect</Button>
              </div>
              
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Video className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Google Meet</p>
                    <p className="text-sm text-muted-foreground">
                      Video conferences and interviews
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleConnectClick("Google Meet")}>Connect</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Email Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email-sender">Default Sender Name</Label>
                <Input id="email-sender" placeholder="Recruitment Team" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-reply-to">Default Reply-To Address</Label>
                <Input id="email-reply-to" placeholder="recruiting@company.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <Textarea 
                  id="email-signature" 
                  rows={3} 
                  placeholder="Your company email signature"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email-tracking"
                    checked={emailTracking}
                    onCheckedChange={setEmailTracking}
                  />
                  <Label htmlFor="email-tracking">Enable Email Tracking</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track when emails are opened and links are clicked
                </p>
              </div>
            </div>
          </>
        )}
        
        <Button
          onClick={handleSaveSettings}
          disabled={!selectedTenantId}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunicationSettings;
