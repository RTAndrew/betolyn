import { PropsWithChildren } from 'react'
import { View, ViewStyle } from 'react-native';

const SafeHorizontalView = ({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) => {
  return <View style={{ paddingHorizontal: 20, ...style }}>{children}</View>;
};

export default SafeHorizontalView