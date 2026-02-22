import React, { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeHorizontalView from '../safe-horizontal-view';
import { Close } from '../icons';
import { ThemedText } from '../ThemedText';

interface ScreenHeaderProps extends HeaderProps {
  onClose?: () => void;
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
  type?: 'close' | 'back';
  iconColor?: string;
}

interface IconContainerProps extends PropsWithChildren {
  onPress: () => void;
  color?: string;
}

const IconContainer = ({ children, onPress, color = '#485164' }: IconContainerProps) => {
  return (
    <Pressable style={[styles.headerIcon, { backgroundColor: color }]} onPress={onPress}>
      {children}
    </Pressable>
  );
};

const QuickActions = ({ children, style, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <View style={[styles.quickActions, style]} {...props}>
      {children}
    </View>
  );
};

interface HeaderProps extends PropsWithChildren {
  title?: string;
  description?: React.ReactNode;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {description && <ThemedText style={styles.headerDescription}>{description}</ThemedText>}
    </View>
  );
};

const ScreenHeader = ({
  onClose,
  type,
  safeArea = true,
  title,
  description,
  children,
  style,
  iconColor = '#485164',
}: ScreenHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeHorizontalView style={[styles.root, { paddingTop: safeArea ? insets.top : 0 }, style]}>
      <View style={styles.headerContainer}>
        {onClose && (
          <IconContainer color={iconColor} onPress={onClose}>
            <Close width={18} height={18} color="white" />
          </IconContainer>
        )}

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
    paddingVertical: 16,
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#61687E',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
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
    borderWidth: 2,
    borderColor: 'rgba(199,209,231, 0.5)',
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 16,
  },
});

ScreenHeader.Icon = IconContainer;
ScreenHeader.QuickActions = QuickActions;

export default ScreenHeader;
