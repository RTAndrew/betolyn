import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';

const DEFAULT_AVATAR = require('@/assets/images/generic-user-profile-image.png');

const DEFAULT_AVATAR_SIZE = 44;

export interface UserCardProps {
  bold?: boolean;
  title: string;
  onPress?: () => void;
  avatarSize?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  direction?: 'row' | 'column';
  avatarSource?: ImageSourcePropType;
  titleNumberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  /** Hairline border under the text column (list separator).
   * @default true
   */
  showBottomBorder?: boolean;
}

export function UserCard({
  avatarSize = DEFAULT_AVATAR_SIZE,
  avatarSource = DEFAULT_AVATAR,
  showBottomBorder = true,
  titleNumberOfLines = 1,
  direction = 'row',
  bold = false,
  onPress,
  prefix,
  suffix,
  style,
  title,
}: UserCardProps) {
  const avatarStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
  };

  const content = (
    <>
      <View style={styles.rowAvatarWrap}>
        <Image source={avatarSource} style={avatarStyle} accessibilityIgnoresInvertColors />
      </View>
      <View style={[styles.rowTextColumn, !showBottomBorder && styles.rowTextColumnNoBorder]}>
        <View style={[styles.rowLabelRow, direction === 'row' && { paddingVertical: 14 }]}>
          {prefix != null ? <View style={styles.prefixSlot}>{prefix}</View> : null}
          <ThemedText
            style={[styles.userName, direction === 'column' && { flex: 0 }]}
            numberOfLines={titleNumberOfLines}
            type={bold ? 'defaultSemiBold' : 'default'}
          >
            {title}
          </ThemedText>
          {suffix != null ? <View style={styles.suffixSlot}>{suffix}</View> : null}
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) =>
          StyleSheet.flatten([
            styles.row,
            pressed && styles.rowPressed,
            { flexDirection: direction, gap: 6, flex: 1 },
            style,
          ])
        }
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={StyleSheet.flatten([styles.row, { flexDirection: direction, gap: 6, flex: 1 }, style])}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  rowPressed: {
    opacity: 0.92,
  },
  row: {
    flex: 1,
    alignItems: 'stretch',
    minHeight: 52,
  },
  rowAvatarWrap: {
    justifyContent: 'center',
  },
  rowTextColumn: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyLight,
  },
  rowTextColumnNoBorder: {
    borderBottomWidth: 0,
  },
  rowLabelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixSlot: {
    flexShrink: 0,
  },
  userName: {
    flex: 1,
    fontSize: 16,
  },
  suffixSlot: {
    flexShrink: 0,
    justifyContent: 'center',
  },
});
