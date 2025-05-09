
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react";

const SocialMediaSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Settings</CardTitle>
        <CardDescription>
          Connect and manage your social media accounts for job posting and outreach
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 p-2 rounded-full">
                <Instagram className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="font-medium">Instagram</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
          
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Linkedin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
          
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-2 rounded-full">
                <Facebook className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Facebook</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
          
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="bg-sky-50 p-2 rounded-full">
                <Twitter className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <p className="font-medium">Twitter</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Canva Integration</h3>
          <p className="text-sm text-muted-foreground">
            Connect your Canva account to create custom graphics for job postings and company branding
          </p>
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
                <p className="font-medium">Canva</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
        
        <Button
          onClick={() => {
            toast({
              title: "Social media settings saved",
              description: "Your social media connections have been updated",
            });
          }}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettings;
