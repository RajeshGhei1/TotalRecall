
import React from "react";
import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialMediaStep = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Social Media Integration</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Connect your social media accounts to streamline job posting and candidate outreach.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-pink-100 p-2 rounded-full">
              <Instagram className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="font-medium">Instagram</p>
              <p className="text-sm text-muted-foreground">
                Share jobs and company culture
              </p>
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
              <p className="text-sm text-muted-foreground">
                Professional networking and job posts
              </p>
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
              <p className="text-sm text-muted-foreground">
                Community building and job sharing
              </p>
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
              <p className="text-sm text-muted-foreground">
                Quick updates and engagement
              </p>
            </div>
          </div>
          <Button variant="outline">Connect</Button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaStep;
