
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface IntegrationItemProps {
  name: string;
  description: string;
  icon: ReactNode;
  status: "connected" | "not_connected";
  onConnect: () => void;
  className?: string;
}

const IntegrationItem = ({
  name,
  description,
  icon,
  status,
  onConnect,
  className = ""
}: IntegrationItemProps) => {
  return (
    <div className={`flex items-center justify-between border p-4 rounded-md ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="bg-muted p-2 rounded-full">
          {icon}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">
            {status === "connected" ? "Connected" : description}
          </p>
        </div>
      </div>
      <Button 
        variant={status === "connected" ? "default" : "outline"} 
        onClick={onConnect}
      >
        {status === "connected" ? "Configure" : "Connect"}
      </Button>
    </div>
  );
};

export default IntegrationItem;
