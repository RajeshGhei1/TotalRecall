
import { toast as sonnerToast } from 'sonner';
import type { ExternalToast } from 'sonner';

export type Toast = ExternalToast & {
  variant?: 'default' | 'destructive' | 'success';
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

export const useToast = () => {
  return {
    toast,
  };
};
