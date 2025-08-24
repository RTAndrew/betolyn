import { View, type ViewProps } from 'react-native';

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
          backgroundColor: '#61687E',
          paddingHorizontal: withHorizontalPadding ? 10 : 0,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
