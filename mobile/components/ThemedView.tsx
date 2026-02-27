import { View, type ViewProps } from 'react-native';
import { colors } from '@/constants/colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  withHorizontalPadding?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  withHorizontalPadding = true,
  ...otherProps
}: ThemedViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.greyLight,
          paddingHorizontal: withHorizontalPadding ? 10 : 0,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
