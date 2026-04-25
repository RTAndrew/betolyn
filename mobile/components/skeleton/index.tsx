import React, { PropsWithChildren } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import { Shimmer } from 'react-native-fast-shimmer';

import { colors } from '@/constants/colors';
import { hexToHexWithAlpha } from '@/utils/hex-rgba';

export interface SkeletonProps {
  type?: 'circle' | 'default';
  borderRadius?: number;
  size?: DimensionValue;
  color?: string;
  style?: ViewStyle;
}

const SHIMMER_GRADIENTS = [
  'transparent',
  hexToHexWithAlpha(colors.greyLighter, 0.35),
  'transparent',
];

const SkeletonGroup = ({
  children,
  count = 6,
  gap = 16,
  style,
}: PropsWithChildren & { count?: number; gap?: number; style?: ViewStyle }) => {
  return (
    <View style={{ gap: gap, ...style }}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>{children}</View>
      ))}
    </View>
  );
};

export function Skeleton({
  color = hexToHexWithAlpha(colors.greyLighter, 0.35),
  type = 'default',
  borderRadius = 4,
  size = 16,
  style,
}: SkeletonProps) {
  const isCircle = type === 'circle';
  const circleRadius = typeof size === 'number' ? size / 2 : 9999;

  const containerStyle: ViewStyle[] = [
    styles.base,
    {
      width: size,
      borderRadius: isCircle ? circleRadius : borderRadius,
      backgroundColor: color ?? colors.greyLight,
    },
  ];

  if (isCircle && size != null) {
    containerStyle.push({ height: size, flexGrow: 0 });
  }

  if (style) {
    containerStyle.push(style);
  }

  return (
    <View style={containerStyle}>
      <Shimmer style={styles.shimmerFill} linearGradients={SHIMMER_GRADIENTS} />
    </View>
  );
}

Skeleton.Group = SkeletonGroup;

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    flexGrow: 1,
    height: 20,
    backgroundColor: colors.greyLight,
  },
  shimmerFill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
