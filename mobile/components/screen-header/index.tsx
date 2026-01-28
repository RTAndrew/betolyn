
import React, { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeHorizontalView from '../safe-horizontal-view';
import { Close } from '../icons';
import { ThemedText } from '../ThemedText';

interface ScreenHeaderProps extends HeaderProps {
  onClose: () => void;
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
  type: 'close' | 'back';
  iconColor?: string;
}

interface IconContainerProps extends PropsWithChildren {
  onPress: () => void;
  color?: string;
}

const IconContainer = ({ children, onPress, color = "#485164" }: IconContainerProps) => {
  return (
    <Pressable style={[styles.headerIcon, { backgroundColor: color }]} onPress={onPress}>
      {children}
    </Pressable>
  );
};

interface HeaderProps extends PropsWithChildren {
  title: string;
  description?: React.ReactNode;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {description && <ThemedText style={styles.headerDescription}>{description}</ThemedText>}
    </View>
  );
}



const ScreenHeader = ({ onClose, type, safeArea = true, title, description, children, style, iconColor = "#485164" }: ScreenHeaderProps) => {
const insets = useSafeAreaInsets();

  return (
    <SafeHorizontalView style={[styles.root, { paddingTop: safeArea ? insets.top : 0 }, style]}>
      <View style={styles.headerContainer}>

        <IconContainer color={iconColor} onPress={onClose}>
        <Close width={18} height={18} color="white" />
      </IconContainer>

      <Header title={title} description={description} />

      <View style={styles.actionContainer}>
          {children}
        </View>
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
    flexDirection: "column",
    alignItems: 'flex-start',
    flex: 1,
  },
  headerDescription: {
    fontSize: 14,
    color: '#C7D1E7',
  },
});

ScreenHeader.Icon= IconContainer;

export default ScreenHeader;
