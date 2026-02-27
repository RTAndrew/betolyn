import React, { PropsWithChildren, useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeHorizontalView from '../safe-horizontal-view';
import { Close, Down, Left } from '../icons';
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

const IconContainer = ({ children, onPress, color = '#485164', ...props }: IconContainerProps) => {
  return (
    <Pressable
      {...props}
      style={StyleSheet.flatten([styles.headerIcon, { backgroundColor: color }, props.style])}
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

    if (type === 'back') return <Left width={24} height={24} color={iconColor} />;

    return <Close width={24} height={24} color={iconColor} />;
  }, [type, iconColor]);

  return <Container>{icon}</Container>;
};

const ScreenHeader = ({
  onClose,
  type,
  safeArea = true,
  title,
  description,
  children,
  style,
  iconContainerColor = '#61687E',
  iconColor = 'white',
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
    color: '#C7D1E7',
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

export default ScreenHeader;
