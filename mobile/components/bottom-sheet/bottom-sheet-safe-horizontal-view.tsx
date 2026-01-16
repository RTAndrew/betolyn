import React from 'react';
import { View, ViewStyle } from 'react-native';

export interface BottomSheetSafeHorizontalViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const BottomSheetSafeHorizontalView = ({
  children,
  style,
}: BottomSheetSafeHorizontalViewProps) => {
  return <View style={{ paddingHorizontal: 16, ...style }}>{children}</View>;
};

export default BottomSheetSafeHorizontalView;
