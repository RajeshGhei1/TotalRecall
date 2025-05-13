
import React from "react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "Select a tenant to manage its settings" }: EmptyStateProps) => {
  return (
    <div className="bg-muted/50 p-6 text-center rounded-md">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyState;
