import { PropsWithChildren } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native';

const SafeHorizontalView = ({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) => {
  return <View style={[style, { paddingHorizontal: 20 }]}>{children}</View>;
};

export default SafeHorizontalView