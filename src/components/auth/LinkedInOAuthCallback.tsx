import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { linkedinOAuthService } from '@/services/linkedinOAuthService';
import { useToast } from '@/hooks/use-toast';

interface LinkedInOAuthCallbackProps {
  onSuccess?: (tenantId: string) => void;
  onError?: (error: string) => void;
}

export const LinkedInOAuthCallback: React.FC<LinkedInOAuthCallbackProps> = ({
  onSuccess,
  onError
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing LinkedIn authorization...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`LinkedIn authorization failed: ${error}`);
        onError?.(error);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter');
        onError?.('Missing authorization parameters');
        return;
      }

      try {
        // Extract tenant ID from state parameter
        const stateData = JSON.parse(atob(state));
        const tenantId = stateData.tenantId;

        if (!tenantId) {
          throw new Error('No tenant ID found in state');
        }

        const success = await linkedinOAuthService.completeOAuthFlow(code, state);

        if (success) {
          setStatus('success');
          setMessage('LinkedIn integration connected successfully!');
          toast({
            title: "LinkedIn Connected",
            description: "Your LinkedIn integration is now active and ready to use."
          });
          onSuccess?.(tenantId);
          
          // Redirect back to settings after a short delay
          setTimeout(() => {
            navigate('/tenant-admin/linkedin-integration');
          }, 2000);
        } else {
          throw new Error('Failed to complete OAuth flow');
        }
      } catch (error) {
        console.error('LinkedIn OAuth callback error:', error);
        setStatus('error');
        setMessage('Failed to complete LinkedIn authorization');
        onError?.(error instanceof Error ? error.message : 'Unknown error');
        
        toast({
          title: "LinkedIn Connection Failed",
          description: "There was an error connecting your LinkedIn account. Please try again.",
          variant: "destructive"
        });
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast, onSuccess, onError]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className={`w-full max-w-md ${getStatusColor()}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">in</span>
            </div>
            LinkedIn Integration
          </CardTitle>
          <CardDescription>
            {status === 'processing' && 'Connecting your LinkedIn account...'}
            {status === 'success' && 'Successfully connected!'}
            {status === 'error' && 'Connection failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-700">{message}</p>
          
          {status === 'error' && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/tenant-admin/linkedin-integration')}
              className="w-full"
            >
              Return to LinkedIn Integration
            </Button>
          )}
          
          {status === 'success' && (
            <p className="text-xs text-gray-600">
              Redirecting you back to LinkedIn Integration...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInOAuthCallback;
