
import React from "react";
import { MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommunicationStep = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Communication Tools</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Set up your communication channels for team collaboration and candidate engagement.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <MessageSquare className="h-6 w-6 text-purple-600" />
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
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-2 rounded-full">
              <Mail className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium">Email Templates</p>
              <p className="text-sm text-muted-foreground">
                Configure outreach email templates
              </p>
            </div>
          </div>
          <Button variant="outline">Configure</Button>
        </div>
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-2 rounded-full">
              <img 
                src="https://cdn.cdnlogo.com/logos/c/50/canva.svg" 
                alt="Canva" 
                className="h-6 w-6" 
              />
            </div>
            <div>
              <p className="font-medium">Canva Integration</p>
              <p className="text-sm text-muted-foreground">
                Creative designs for job posts and branding
              </p>
            </div>
          </div>
          <Button variant="outline">Connect</Button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationStep;
