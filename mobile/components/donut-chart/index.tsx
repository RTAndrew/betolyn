import React, { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export interface DonutChartSegment {
  /** Segment value (as percentage or relative; will be normalized to 100% total). */
  value: number;
  /** Segment color. */
  color: string;
}

export interface DonutChartProps {
  /** Segments in render order: each has value and color. */
  segments: DonutChartSegment[];
  /** Chart diameter in pixels. */
  size?: number;
  /** Ring thickness in pixels. */
  strokeWidth?: number;
  /** When true, segment ends are drawn with rounded corners (stroke line cap). Default true. */
  rounded?: boolean;
  /** Content rendered in the center of the donut (e.g. "57%" or "$1,590 / $3,000"). */
  label?: ReactNode;
  /** Optional container style (e.g. to center the chart in a flex layout). */
  style?: ViewStyle;
}

/**
 * Donut chart built with pure CSS/SVG (no animation).
 * Renders segments in the same order as the segments array, starting from 12 o'clock, clockwise.
 */
export const DonutChart = ({
  segments,
  size = 120,
  strokeWidth = 12,
  rounded = true,
  label,
  style,
}: DonutChartProps) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const normalized =
    total > 0
      ? segments.map((s) => ({ ...s, percent: (s.value / total) * 100 }))
      : segments.map((s) => ({ ...s, percent: 0 }));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segmentData: { length: number; offset: number; color: string }[] = [];
  let offset = 0;
  for (let i = 0; i < normalized.length; i++) {
    const percent = normalized[i]!.percent;
    const length =
      i === normalized.length - 1 ? circumference - offset : (percent / 100) * circumference;
    segmentData.push({
      length,
      offset: -offset,
      color: normalized[i]!.color,
    });
    offset += length;
  }

  const lineCap = rounded ? 'round' : 'butt';

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
          <G rotation={-90} origin={`${center}, ${center}`}>
            {segmentData.map((seg, i) => (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.length} ${circumference}`}
                strokeDashoffset={seg.offset}
                strokeLinecap={lineCap}
              />
            ))}
          </G>
        </Svg>
        {label != null ? (
          <View style={[styles.label, { width: size, height: size }]} pointerEvents="none">
            {label}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  label: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
