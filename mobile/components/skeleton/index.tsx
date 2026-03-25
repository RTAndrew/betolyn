import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Shimmer } from 'react-native-fast-shimmer';

import { colors } from '@/constants/colors';
import { hexToHexWithAlpha } from '@/utils/hex-rgba';

export interface SkeletonProps {
  type?: 'circle' | 'default';
  borderRadius?: number;
  size?: number;
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
  type = 'default',
  borderRadius = 4,
  size = 16,
  color = hexToHexWithAlpha(colors.greyLighter, 0.35),
  style,
}: SkeletonProps) {
  const isCircle = type === 'circle';

  const containerStyle: ViewStyle[] = [
    styles.base,
    {
      borderRadius: isCircle && size != null ? size / 2 : isCircle ? 9999 : borderRadius,
      backgroundColor: color ?? colors.greyLight,
    },
  ];

  if (isCircle && size != null) {
    containerStyle.push({ width: size, height: size });
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
    backgroundColor: colors.greyLight,
    overflow: 'hidden',
  },
  shimmerFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
