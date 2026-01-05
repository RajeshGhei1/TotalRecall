
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { logger } from "@/utils/logger";

// Schema for login validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  [key: string]: unknown;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<{ user: User; redirectPath: string }>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormValues) => {
    console.log('🔵 LoginForm: Starting login process', { email: data.email });
    logger.debug('LoginForm: Starting login process');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔵 LoginForm: Calling onSubmit...');
      const result = await onSubmit(data);
      console.log('🟢 LoginForm: Login successful!', { 
        redirectPath: result.redirectPath, 
        userId: result.user?.id 
      });
      logger.debug('LoginForm: Login successful, redirecting to:', result.redirectPath);
      logger.debug('LoginForm: User data:', result.user);
      
      // Wait a bit longer to ensure auth state is fully updated
      // This is important because onAuthStateChange might take a moment
      setTimeout(() => {
        console.log('🔵 LoginForm: Navigating to:', result.redirectPath);
        logger.debug('LoginForm: Navigating to:', result.redirectPath);
        navigate(result.redirectPath, { replace: true });
      }, 500);
    } catch (err: unknown) {
      console.error('🔴 LoginForm: Login error caught:', err);
      logger.error('LoginForm: Login error:', err);
      
      // Handle Supabase errors which have a different structure
      let errorMessage = 'Login failed. Please try again.';
      
      if (err && typeof err === 'object') {
        // Supabase errors have a 'message' property
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
          console.error('🔴 Error message:', err.message);
        } else if ('error' in err && err.error && typeof err.error === 'object' && 'message' in err.error) {
          // Sometimes errors are nested
          errorMessage = String(err.error.message);
          console.error('🔴 Nested error message:', err.error.message);
        } else if (err instanceof Error) {
          errorMessage = err.message;
          console.error('🔴 Error instance message:', err.message);
        }
      }
      
      console.error('🔴 Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🔵 LoginForm: Process complete, loading set to false');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
                  type="email"
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
};
