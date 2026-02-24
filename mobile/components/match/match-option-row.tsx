import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CaretDown, CaretUp } from '@/components/icons';
import { ThemedText } from '@/components/ThemedText';

export interface MatchOptionRowControlProps {
  value: number;
  status: 'success' | 'error' | undefined;
}

interface MatchOptionRowProps {
  title: string;
  value?: number;
  onValueChange?: (value: number) => void;
  style?: ViewStyle;
  children: React.ReactNode | ((props: MatchOptionRowControlProps) => React.ReactNode);
}

/**
 * Displays a value (can be an odd value, a score, etc.) and
 * @param children - The children of the match option row, suppor
 * passing a function that returns a ReactNode, the function will be called
 * with the value and status props.
 */
export const MatchOptionRow = ({
  title,
  value,
  style,
  children,
  onValueChange,
}: MatchOptionRowProps) => {
  const scoreRef = useRef<number>(value ?? 0);

  const inputStatus = useMemo(() => {
    if (value === undefined) return undefined;
    const isIncreasing = value > scoreRef.current;
    const isDecreasing = value < scoreRef.current;
    const status: 'success' | 'error' | undefined = isIncreasing
      ? 'success'
      : isDecreasing
        ? 'error'
        : undefined;
    return { status, isIncreasing, isDecreasing };
  }, [value]);

  useEffect(() => {
    if (value !== undefined) {
      onValueChange?.(scoreRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rightContent =
    typeof children === 'function'
      ? children({ value: value ?? 0, status: inputStatus?.status })
      : children;

  return (
    <View style={[styles.root, style]}>
      <View style={styles.body}>
        {value !== undefined && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText style={styles.value}>{scoreRef.current}</ThemedText>
            {inputStatus?.isIncreasing && <CaretUp width={10} height={10} color="#3CC5A4" />}
            {inputStatus?.isDecreasing && <CaretDown width={10} height={10} color="#F80069" />}
          </View>
        )}
        <ThemedText ellipsizeMode="tail" style={styles.title}>
          {title}
        </ThemedText>
      </View>

      {rightContent}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CA41',
  },
});
