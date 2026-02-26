import { ThemedText } from '@/components/ThemedText';
import { hexToRgba } from '@/utils/hex-rgba';
import { LinearGradient } from 'expo-linear-gradient';
import React, { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';

const LiveTag = () => (
  <LinearGradient
    colors={['#EE9AE5', '#5961F9']}
    start={{ x: 0, y: 1.5 }}
    end={{ x: 1, y: 0 }}
    style={[styles.root, { borderWidth: 0 }]}
  >
    <View style={styles.liveDot} />
    <ThemedText style={styles.text}>Live</ThemedText>
  </LinearGradient>
);

export interface TagProps {
  title: string;
  textColor?: string;
  icon?: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

const Tag = ({ title, icon, borderColor, backgroundColor, textColor, style }: TagProps) => (
  <View style={[styles.root, { borderColor, backgroundColor }, style]}>
    {icon}
    <ThemedText style={[styles.text, { color: textColor }]}>{title}</ThemedText>
  </View>
);

interface ActiveTagProps extends Pick<TagProps, 'icon'> {
  title?: string;
}

const ActiveTag = ({ title = 'Active', icon }: ActiveTagProps) => {
  return (
    <Tag
      icon={icon}
      title={title}
      textColor="#36D399"
      borderColor="#36D399"
      backgroundColor={hexToRgba('#36D399', 0.12)}
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
    borderWidth: 1,
  },
  live: {},
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});

Tag.Live = LiveTag;
Tag.Active = ActiveTag;

export default Tag;
