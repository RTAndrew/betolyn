import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';

import { Button } from '../button';
import { NoSearchFound as NoSearchFoundIllustration, NoSlipsFound } from '../illustrations';
import { ThemedText } from '../ThemedText';

interface EmptyStateProps extends PropsWithChildren {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

const EmptyState = ({ icon, title, description, style, children }: EmptyStateProps) => {
  return (
    <View style={[styles.root, style]}>
      {icon}

      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      <ThemedText style={styles.description}>{description}</ThemedText>

      <View style={styles.footer}>{children}</View>
    </View>
  );
};

interface NoBetsEmptyStateProps extends PropsWithChildren {
  title?: string;
  description?: string;
  showButton?: boolean;
}

const NoBetsEmptyState = ({ title, description, showButton = true }: NoBetsEmptyStateProps) => {
  return (
    <EmptyState
      title={title ?? 'No bets found'}
      description={
        description ??
        'You are missing out of the fun. Place a bet, compete with friends and start winning.'
      }
      icon={
        <NoSlipsFound width={150} height={150} fill={colors.greyLight} color={colors.greyMedium} />
      }
    >
      {showButton && <Button.Root onPress={() => router.push('/')}>See events</Button.Root>}
    </EmptyState>
  );
};

interface NoSearchResultsProps extends Omit<NoBetsEmptyStateProps, 'showButton'> {
  onClearFilters?: () => void;
  color?: string;
}

const NoSearchResults = ({
  title,
  description,
  onClearFilters,
  color = colors.greyMedium,
}: NoSearchResultsProps) => {
  return (
    <EmptyState
      title={title ?? 'No search results found'}
      description={description ?? 'Try a different search or clear the filters.'}
      icon={<NoSearchFoundIllustration width={150} height={150} color={color} />}
    >
      {onClearFilters && (
        <Button.Root onPress={() => onClearFilters?.()}>Clear filters</Button.Root>
      )}
    </EmptyState>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    marginTop: 12,
    color: colors.white,
  },
  description: {
    textAlign: 'center',
    color: colors.greyLighter,
  },
  footer: {
    width: '100%',
    marginTop: 20,
  },
});

EmptyState.NoBets = NoBetsEmptyState;
EmptyState.NoSearch = NoSearchResults;

export default EmptyState;
