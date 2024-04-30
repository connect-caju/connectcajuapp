
// @ts-expect-error TS(2307): Cannot find module 'class-variance-authority' or i... Remove this comment to see the full error message
import { type VariantProps, cva } from 'class-variance-authority';

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Text, TouchableOpacity } from 'react-native';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'flex flex-row items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        ghost: 'bg-slate-700',
        link: 'text-primary underline-offset-4',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-2',
        lg: 'h-12 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('text-center font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      ghost: 'text-primary-foreground',
      link: 'text-primary-foreground underline',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  label: string;
  labelClasses?: string;
}
function Button({
  label,
  labelClasses,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <Text
        className={cn(
          buttonTextVariants({ variant, size, className: labelClasses })
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export { Button, buttonVariants, buttonTextVariants };
