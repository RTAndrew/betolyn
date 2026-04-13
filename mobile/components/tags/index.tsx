import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { hexToRgba } from '@/utils/hex-rgba';

import PlayFilled from '../icons/play-filled';

const LiveTag = () => (
  <LinearGradient
    colors={['#EE9AE5', '#5961F9']}
    start={{ x: 0, y: 1.5 }}
    end={{ x: 1, y: 0 }}
    style={[styles.root, { borderWidth: 0 }]}
  >
    <PlayFilled width={12} height={12} />
    <ThemedText style={styles.text}>Live</ThemedText>
  </LinearGradient>
);

export interface TagProps {
  title: string;
  textColor?: string;
  icon?: ReactNode;
  /** If passed, it calculates the borderColor, textColor and backgroundColor */
  color?: `#${string}`;
  borderColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

const Tag = ({ title, icon, style, color, ...props }: TagProps) => {
  const { borderColor, backgroundColor, textColor } = useMemo(() => {
    if (color) {
      return {
        borderColor: hexToRgba(color, 0.5),
        backgroundColor: hexToRgba(color, 0.12),
        textColor: color,
      };
    }

    return {
      borderColor: props.borderColor,
      backgroundColor: props.backgroundColor,
      textColor: props.textColor || 'white',
    };
  }, [props.backgroundColor, props.borderColor, props.textColor, color]);

  return (
    <View
      style={[styles.root, { borderColor: borderColor, backgroundColor: backgroundColor }, style]}
    >
      {icon}
      <ThemedText style={[styles.text, { color: textColor }]}>{title}</ThemedText>
    </View>
  );
};

interface DerivedTagProps extends Pick<TagProps, 'icon'> {
  title?: string;
}

const ActiveTag = ({ title = 'Active', icon }: DerivedTagProps) => {
  return (
    <Tag
      icon={icon}
      title={title}
      textColor="#36D399"
      borderColor={'#36d39980'}
      backgroundColor="#46616A"
    />
  );
};

const PendingTag = ({ title = 'Pending', icon }: DerivedTagProps) => {
  return (
    <Tag
      icon={icon}
      title={title}
      textColor="#F3CA41"
      borderColor={'#f3ca4180'}
      backgroundColor="#f3ca411f"
    />
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
    // borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});

Tag.Live = LiveTag;
Tag.Active = ActiveTag;
Tag.Pending = PendingTag;

export default Tag;
