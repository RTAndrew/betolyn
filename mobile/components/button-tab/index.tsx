import React, { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ButtonTabOption {
  label: string;
  value: string;
}

export interface ButtonTabProps {
  activeIndex?: number;
  defaultIndex?: number;
  options: ButtonTabOption[] | string[];
  onIndexChange?: (index: number) => void;
}

const normalizeOptions = (options: ButtonTabOption[] | string[]): ButtonTabOption[] =>
  options.map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt));

export function ButtonTab({
  activeIndex: controlledIndex,
  options: rawOptions,
  defaultIndex = 0,
  onIndexChange,
}: ButtonTabProps) {
  const options = normalizeOptions(rawOptions);
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : uncontrolledIndex;

  const [segmentWidth, setSegmentWidth] = useState(0);
  const segmentWidthShared = useSharedValue(0);
  const activeIndexShared = useSharedValue(activeIndex);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width } = e.nativeEvent.layout;
      const paddingHorizontal = 8; // padding 4 left + 4 right
      const innerWidth = width - paddingHorizontal;
      const w = innerWidth / options.length;
      setSegmentWidth(w);
      segmentWidthShared.value = w;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.length]
  );

  useEffect(() => {
    activeIndexShared.value = withTiming(activeIndex, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const selectIndex = useCallback(
    (index: number) => {
      if (!isControlled) setUncontrolledIndex(index);
      onIndexChange?.(index);
    },
    [isControlled, onIndexChange]
  );

  const sliderAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: activeIndexShared.value * (segmentWidthShared.value - 1), // -1 to avoid being too close the border
      },
    ],
  }));

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.slider,
            {
              width: segmentWidth,
            },
            sliderAnimatedStyle,
          ]}
        />
      )}
      {options.map((opt, index) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.tab}
          onPress={() => {
            selectIndex(index);
          }}
          activeOpacity={1}
          accessibilityRole="tab"
          accessibilityState={{ selected: index === activeIndex }}
        >
          <Text
            style={[
              styles.tabText,
              index === activeIndex ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const COLORS = {
  container: '#21243E',
  containerBorder: '#43466D',
  activeBg: '#1E264E',
  activeBorder: '#7E87F1',
  activeText: '#FFFFFF',
  inactiveText: '#8189A7',
} as const;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.container,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.containerBorder,
    padding: 4,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: COLORS.activeBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.activeBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.activeText,
  },
  tabTextInactive: {
    color: COLORS.inactiveText,
  },
});

export default ButtonTab;
