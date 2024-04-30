// @ts-expect-error TS(2307): Cannot find module 'expo-image' or its correspondi... Remove this comment to see the full error message
import { Image } from 'expo-image';
import { useState } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Text, View } from 'react-native';

interface AvatarProps {
  src: string;
  width?: number;
  height?: number;
  fallback?: string;
  imageClasses?: string;
  fallbackViewClasses?: string;
  fallbackTextClasses?: string;
}
export function Avatar({
  src,
  width = 60,
  height = 60,
  fallback = '',
  imageClasses = 'rounded-full',
  fallbackViewClasses = 'border border-black p-4 rounded-full dark:border-white',
  fallbackTextClasses = 'text-base text-black dark:text-white',
}: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return hasImageError ? (
    <View className={fallbackViewClasses}>
      <Text className={fallbackTextClasses}>{fallback}</Text>
    </View>
  ) : (
    <Image
      className={imageClasses}
      contentFit="cover"
      source={src}
      style={{ width, height }}
      onError={() => setHasImageError(prevState => !prevState)}
    />
  );
}
