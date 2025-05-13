
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

// Re-exporting toast function with our custom props
export const toast = (props: ToastProps) => {
  return sonnerToast[props.variant === "destructive" ? "error" : "success"]
    (props.title, {
      description: props.description,
      action: props.action,
    });
};

// Adding back the useToast hook for compatibility
export const useToast = () => {
  return {
    toast
  };
};
