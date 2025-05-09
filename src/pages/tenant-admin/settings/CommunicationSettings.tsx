
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Video, Phone } from "lucide-react";

const CommunicationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Tools</CardTitle>
        <CardDescription>
          Configure your communication channels and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium">Messaging Platforms</h3>
          
          {/* Slack */}
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
            <Button variant="outline">Connect</Button>
          </div>
          
          {/* Microsoft Teams */}
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
            <Button variant="outline">Connect</Button>
          </div>
          
          {/* WhatsApp */}
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
            <Button variant="outline">Connect</Button>
          </div>
          
          {/* SMS */}
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
            <Button variant="outline">Connect</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-md font-medium">Video Conferencing</h3>
          
          {/* Zoom */}
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
            <Button variant="outline">Connect</Button>
          </div>
          
          {/* Google Meet */}
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
            <Button variant="outline">Connect</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-md font-medium">Voice Communications</h3>
          
          {/* Click-to-Call */}
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <Phone className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Click-to-Call</p>
                <p className="text-sm text-muted-foreground">
                  One-click calling solution for recruitment
                </p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
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
              <Switch id="email-tracking" />
              <Label htmlFor="email-tracking">Enable Email Tracking</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Track when emails are opened and links are clicked
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => {
            toast({
              title: "Communication settings saved",
              description: "Your communication preferences have been updated",
            });
          }}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunicationSettings;
