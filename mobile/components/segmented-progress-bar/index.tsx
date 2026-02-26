import React, { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface SegmentedProgressBarSegment {
  /** Segment value (as percentage or relative; will be normalized to 100% total). */
  value: number;
  /** Segment color. */
  color: string;
}

export interface SegmentedProgressBarProps {
  /** Segments in render order: each has value and color. */
  segments: SegmentedProgressBarSegment[];
  /** Content rendered above the bar (e.g. "$790 / $2,000"). */
  topLabel?: ReactNode;
  /** Content rendered below the bar (e.g. "75% Risk Level"). */
  bottomLabel?: ReactNode;
  /** Bar height in pixels. Default 10. */
  height?: number;
  /** When true, bar has rounded pill caps. Default true. */
  rounded?: boolean;
  /** Optional container style (e.g. to center in a flex layout). */
  style?: ViewStyle;
}

/**
 * Horizontal segmented progress bar. Renders segments in order, normalized to 100%.
 * Optional top and bottom labels; bar is pill-shaped by default.
 */
export const SegmentedProgressBar = ({
  segments,
  topLabel,
  bottomLabel,
  height = 10,
  rounded = true,
  style,
}: SegmentedProgressBarProps) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const normalized =
    total > 0
      ? segments.map((s) => ({ ...s, percent: (s.value / total) * 100 }))
      : segments.map((s) => ({ ...s, percent: 0 }));

  const radius = rounded ? height / 2 : 0;

  return (
    <View style={[styles.wrapper, style]}>
      {topLabel != null ? (
        <View style={styles.topLabel} pointerEvents="none">
          {topLabel}
        </View>
      ) : null}
      <View style={[styles.barContainer, { height, borderRadius: radius }]}>
        {normalized.map((seg, i) => {
          const isFirst = i === 0;
          const isLast = i === normalized.length - 1;
          return (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  flex: seg.percent,
                  backgroundColor: seg.color,
                  borderTopLeftRadius: isFirst ? radius : 0,
                  borderBottomLeftRadius: isFirst ? radius : 0,
                  borderTopRightRadius: isLast ? radius : 0,
                  borderBottomRightRadius: isLast ? radius : 0,
                },
              ]}
            />
          );
        })}
      </View>
      {bottomLabel != null ? (
        <View style={styles.bottomLabel} pointerEvents="none">
          {bottomLabel}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  topLabel: {
    marginBottom: 6,
    alignItems: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  segment: {
    minWidth: 0,
  },
  bottomLabel: {
    marginTop: 6,
    alignItems: 'center',
  },
});
