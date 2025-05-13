
import { useToast as useSonnerToast, toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

// Create a wrapper for the sonner toast function with our app's expected API
export function toast(props: ToastProps) {
  const { title, description, variant, action } = props;
  
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
      action
    });
  }

  return sonnerToast(title, {
    description,
    action
  });
}

// Export the hook for components that need direct access
export const useToast = () => {
  return {
    toast
  };
};
