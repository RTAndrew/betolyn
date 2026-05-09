import type { SvgProps } from 'react-native-svg';

import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

import { Close, Down, Left, Sync } from '../icons';
import SafeHorizontalView from '../safe-horizontal-view';
import { ThemedText } from '../ThemedText';

interface ScreenHeaderProps extends HeaderProps {
  onClose?: () => void;
  safeArea?: boolean;
  iconColor?: string;
  iconContainerColor?: string;
  style?: StyleProp<ViewStyle>;
  type?: 'close' | 'back' | 'down';
}

interface IconContainerProps extends PropsWithChildren<PressableProps> {
  onPress: () => void;
  color?: string;
}

interface RefreshProps extends PressableProps {
  onPress: () => void;
  loading?: boolean;
  iconProps?: SvgProps;
}

const IconContainer = ({
  children,
  onPress,
  color = colors.greyMedium,
  ...props
}: IconContainerProps) => {
  return (
    <Pressable
      {...props}
      style={StyleSheet.flatten([
        styles.headerIcon,
        { backgroundColor: color },
        props.style,
        props.disabled && { opacity: 0.5 },
      ])}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const QuickActions = ({ children, style, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <View style={StyleSheet.flatten([styles.quickActions, style])} {...props}>
      {children}
    </View>
  );
};

const RefreshIcon = ({ onPress, loading = false, iconProps, ...props }: RefreshProps) => {
  const spin = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      spin.value = withRepeat(withTiming(360, { duration: 800, easing: Easing.linear }), -1, false);
      return;
    }

    cancelAnimation(spin);
    spin.value = withTiming(0, { duration: 200 });
  }, [loading, spin]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  return (
    <IconContainer onPress={onPress} disabled={loading} {...props}>
      <Animated.View style={animatedStyle}>
        <Sync color={loading ? colors.greyLighter : iconProps?.color} {...iconProps} />
      </Animated.View>
    </IconContainer>
  );
};

interface HeaderProps extends PropsWithChildren {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {typeof title === 'string' ? <ThemedText type="subtitle">{title}</ThemedText> : title}
      {description && <ThemedText style={styles.headerDescription}>{description}</ThemedText>}
    </View>
  );
};

const CloseIcon = ({
  iconColor,
  iconContainerColor,
  onClose,
  type,
}: Pick<ScreenHeaderProps, 'iconColor' | 'iconContainerColor' | 'onClose' | 'type'>) => {
  const Container = ({ children }: PropsWithChildren) => {
    if (!onClose) return <></>;

    return (
      <IconContainer color={iconContainerColor} onPress={onClose}>
        {children}
      </IconContainer>
    );
  };

  const icon = useMemo(() => {
    if (type === 'down') return <Down color={iconColor} />;

    if (type === 'back') return <Left color={iconColor} />;

    return <Close color={iconColor} />;
  }, [type, iconColor]);

  return <Container>{icon}</Container>;
};

const ScreenHeader = ({
  iconContainerColor = colors.greyLight,
  iconColor = 'white',
  safeArea = true,
  description,
  children,
  onClose,
  type,
  title,
  style,
}: ScreenHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeHorizontalView style={[styles.root, { paddingTop: safeArea ? insets.top : 0 }, style]}>
      <View style={styles.headerContainer}>
        <CloseIcon
          iconContainerColor={iconContainerColor}
          iconColor={iconColor}
          onClose={onClose}
          type={type}
        />

        {(title || description) && <Header title={title} description={description} />}

        <View style={styles.actionContainer}>{children}</View>
      </View>
    </SafeHorizontalView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 6,
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: 'red',
  },
  actionContainer: {
    gap: 8,
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerDescription: {
    fontSize: 14,
    color: colors.greyLighter,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: 'rgba(199,209,231, 0.5)',
    borderRadius: 100,
    gap: 8,
  },
});

ScreenHeader.Icon = IconContainer;
ScreenHeader.QuickActions = QuickActions;
ScreenHeader.RefreshIcon = RefreshIcon;

export default ScreenHeader;
