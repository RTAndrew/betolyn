import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';

import { Button } from '../button';
import { NoSearchFound as NoSearchFoundIllustration, NoSlipsFound } from '../illustrations';
import SafeHorizontalView from '../safe-horizontal-view';
import { ThemedText } from '../ThemedText';

interface EmptyStateProps extends PropsWithChildren {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
  center?: boolean;
}

interface ExtendableEmptyStateProps extends Omit<EmptyStateProps, 'icon'> {}

const EmptyState = ({
  icon,
  title,
  description,
  style,
  children,
  center = false,
}: EmptyStateProps) => {
  return (
    <SafeHorizontalView style={[styles.root, style, center && { marginTop: 150 }]}>
      {icon}

      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      <ThemedText style={styles.description}>{description}</ThemedText>

      <View style={styles.footer}>{children}</View>
    </SafeHorizontalView>
  );
};

interface NoBetsEmptyStateProps extends Partial<ExtendableEmptyStateProps> {
  title?: string;
  description?: string;
  showButton?: boolean;
}

const NoBetsEmptyState = ({
  title,
  description,
  showButton = true,
  ...props
}: NoBetsEmptyStateProps) => {
  return (
    <EmptyState
      {...props}
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

interface NoSearchResultsProps extends Partial<ExtendableEmptyStateProps> {
  onClearFilters?: () => void;
  color?: string;
}

const NoSearchResults = ({
  title,
  description,
  onClearFilters,
  color = colors.greyMedium,
  children,
  ...props
}: NoSearchResultsProps) => {
  return (
    <EmptyState
      {...props}
      title={title ?? 'No search results found'}
      description={description ?? 'Try a different search or clear the filters.'}
      icon={<NoSearchFoundIllustration width={150} height={150} color={color} />}
    >
      {onClearFilters && (
        <Button.Root onPress={() => onClearFilters?.()}>Clear filters</Button.Root>
      )}
      {children}
    </EmptyState>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

EmptyState.NoBets = NoBetsEmptyState;
EmptyState.NoSearch = NoSearchResults;

export default EmptyState;
