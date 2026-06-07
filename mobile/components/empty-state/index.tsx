import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';

import { Button } from '../button';
import FullScreenCentered, { FullScreenCenteredProps } from '../full-screen-centered';
import { NoSearchFound as NoSearchFoundIllustration, NoSlipsFound } from '../illustrations';
import SafeHorizontalView from '../safe-horizontal-view';
import { ThemedText } from '../ThemedText';

interface EmptyStateProps extends PropsWithChildren {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
  center?: boolean | Pick<FullScreenCenteredProps, 'includeTabBar'>;
}

interface ExtendableEmptyStateProps extends Omit<EmptyStateProps, 'icon'> {}

const EmptyState = ({
  icon,
  title,
  description,
  style,
  children,
  size = 'large',
  center = false,
}: EmptyStateProps) => {
  const Component = () => {
    return (
      <SafeHorizontalView style={[styles.root, style]}>
        {icon}

        <ThemedText type="subtitle" style={[styles.title, size === 'small' && styles.smallTitle]}>
          {title}
        </ThemedText>

        {description && <ThemedText style={styles.description}>{description}</ThemedText>}

        <View style={styles.footer}>{children}</View>
      </SafeHorizontalView>
    );
  };

  if (center) {
    return (
      <FullScreenCentered
        includeTabBar={typeof center === 'boolean' ? center : center.includeTabBar}
      >
        <Component />
      </FullScreenCentered>
    );
  }

  return <Component />;
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
      title={title ?? 'Nenhuma aposta encontrada'}
      description={description ?? 'Um homem sem ficha é um homem sem esperança.'}
      icon={
        <NoSlipsFound width={150} height={150} fill={colors.greyLight} color={colors.greyMedium} />
      }
    >
      {showButton && <Button.Root onPress={() => router.push('/')}>Ver eventos</Button.Root>}
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
      title={title ?? 'Nenhum resultado encontrado'}
      description={description ?? 'Tente uma pesquisa diferente ou limpe os filtros.'}
      icon={
        <NoSearchFoundIllustration
          width={props.size === 'small' ? 75 : 150}
          height={props.size === 'small' ? 75 : 150}
          color={color}
        />
      }
    >
      {onClearFilters && (
        <Button.Root onPress={() => onClearFilters?.()}>Limpar filtros</Button.Root>
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
    paddingVertical: 20,
  },
  title: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.white,
  },
  smallTitle: {
    fontSize: 16,
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
