
import { toast as sonnerToast } from 'sonner';
import type { ExternalToast } from 'sonner';

// Extend ExternalToast to include the title property
export type Toast = ExternalToast & {
  variant?: 'default' | 'destructive' | 'success';
  title?: string; // Added title property explicitly
};

export function toast(props: Toast) {
  const { variant, ...restProps } = props;
  
  switch (variant) {
    case 'destructive':
      return sonnerToast.error(props.title, {
        ...restProps,
      });
    case 'success':
      return sonnerToast.success(props.title, {
        ...restProps,
      });
    default:
      return sonnerToast(props.title, {
        ...restProps,
      });
  }
}

// Just return the toast function, without the toasts array
// as sonner doesn't expose this in the same way shadcn does
export const useToast = () => {
  return {
    toast,
  };
};
