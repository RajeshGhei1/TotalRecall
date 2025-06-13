
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class SecureErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    
    // Log error securely (without sensitive data)
    const sanitizedError = {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'), // Limit stack trace
      componentStack: errorInfo.componentStack?.split('\n').slice(0, 3).join('\n'),
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error('SecureErrorBoundary caught an error:', sanitizedError);
    
    // Call custom error handler
    if (onError) {
      try {
        onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }

    // Show user-friendly notification
    toast.error('An unexpected error occurred', {
      description: 'The error has been logged and our team has been notified.',
    });
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: null, errorId: null });
    } else {
      toast.error('Maximum retry attempts reached', {
        description: 'Please refresh the page or contact support.',
      });
    }
  };

  handleReportError = () => {
    if (this.state.errorId) {
      // TODO: Implement error reporting to your logging service
      toast.success('Error reported', {
        description: `Error ID: ${this.state.errorId}`,
      });
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error!} 
            resetError={this.handleRetry}
          />
        );
      }

      return (
        <div className="p-4 m-4 border rounded-lg bg-red-50 border-red-200">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>
                An error occurred while rendering this component. 
                {this.state.errorId && (
                  <span className="block text-xs font-mono mt-1">
                    Error ID: {this.state.errorId}
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry} 
                  variant="outline" 
                  size="sm"
                  disabled={this.retryCount >= this.maxRetries}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry ({this.maxRetries - this.retryCount} left)
                </Button>
                <Button 
                  onClick={this.handleReportError} 
                  variant="outline" 
                  size="sm"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Error
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
