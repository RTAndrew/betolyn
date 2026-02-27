import { ThemedText } from '@/components/ThemedText';
import React, { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

export interface StatItem {
  title: ReactNode;
  description: ReactNode;
}

export interface StatsProps {
  title: ReactNode;
  description: ReactNode;
}

export const Stats = ({ title, description }: StatsProps) => {
  return (
    <View style={styles.stat}>
      {typeof description === 'string' ? (
        <ThemedText style={styles.statDescription} type="subtitle">
          {description}
        </ThemedText>
      ) : (
        description
      )}
      {typeof title === 'string' ? (
        <ThemedText style={styles.statTitle}>{title}</ThemedText>
      ) : (
        title
      )}
    </View>
  );
};

export interface StatsGroupProps {
  items: StatItem[];
  style?: ViewStyle;
}

const StatsGroup = ({ items, style }: StatsGroupProps) => {
  return (
    <View style={[styles.group, style]}>
      {items.map((item, index) => (
        <Stats key={index} title={item.title} description={item.description} />
      ))}
    </View>
  );
};

Stats.Group = StatsGroup;

export type StatsComponent = typeof Stats & { Group: typeof StatsGroup };

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    gap: 32,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statTitle: {
    color: colors.greyLighter50,
    fontWeight: '500',
  },
  statDescription: {
    fontSize: 24,
    // fontWeight: '700',
  },
});
