import { forwardRef } from 'react';

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Text, TextInput, View } from 'react-native';

import { cn } from '../lib/utils';

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
}
const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, labelClasses, inputClasses, ...props }, ref) => (
    <View className={cn('flex flex-col gap-1.5', className)}>
      {label && <Text className={cn('text-base', labelClasses)}>{label}</Text>}
      <TextInput
        className={cn(
          inputClasses,
          'border border-input py-2.5 px-4 rounded-lg'
        )}
        {...props}
      />
    </View>
  )
);

export { Input };
