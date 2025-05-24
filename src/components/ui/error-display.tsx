
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  title = "Error",
  className 
}) => {
  if (!error) return null;

  const isNetworkError = error.message.toLowerCase().includes('network') || 
                        error.message.toLowerCase().includes('fetch');

  return (
    <Alert variant="destructive" className={className}>
      {isNetworkError ? <WifiOff className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{error.message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

interface QueryErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  entityName?: string;
  className?: string;
}

export const QueryErrorDisplay: React.FC<QueryErrorDisplayProps> = ({
  error,
  onRetry,
  entityName = "data",
  className
}) => {
  const errorMessage = error?.message || `Failed to load ${entityName}`;
  
  return (
    <ErrorDisplay
      error={new Error(errorMessage)}
      onRetry={onRetry}
      title={`Failed to load ${entityName}`}
      className={className}
    />
  );
};

export const NetworkErrorDisplay: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <Alert variant="destructive">
    <WifiOff className="h-4 w-4" />
    <AlertTitle>Connection Error</AlertTitle>
    <AlertDescription className="mt-2">
      <p className="mb-3">Unable to connect to the server. Please check your internet connection.</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <Wifi className="h-4 w-4 mr-2" />
          Retry connection
        </Button>
      )}
    </AlertDescription>
  </Alert>
);
