import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '@/constants/colors';

import { ThemedText } from '../ThemedText';

export interface ButtonProps extends PropsWithChildren<TouchableOpacityProps> {
  variant?: 'solid' | 'outline' | 'text';
  destructive?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  color?: string;
  loading?: boolean;
}

const Loading = ({ color }: { color?: string }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={color ?? 'white'} />
    </View>
  );
};

export const GradientButton = ({
  children,
  style,
  disabled,
  loading,
  ...props
}: TouchableOpacityProps & { loading?: boolean }) => {
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      style={[disabled && styles.disabled]}
      {...props}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.root, style]}
        colors={[colors.terciary, colors.primary]}
      >
        {loading ? <Loading /> : <Text style={styles.text}> {children} </Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const NormalButton = ({
  variant = 'solid',
  destructive,
  children,
  disabled,
  loading,
  style,
  color,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      style={[
        styles.root,
        disabled && styles.disabled,
        variant === 'solid' && styles.solid,
        variant === 'outline' && styles.outline,
        style,
      ]}
      {...props}
    >
      <ThemedText
        style={[
          styles.text,
          color && { color },
          destructive && styles.destructive,
          variant === 'text' && styles.variantText,
        ]}
      >
        {loading ? <Loading color={color} /> : children}
      </ThemedText>
    </TouchableOpacity>
  );
};

export const Button = {
  Root: NormalButton,
  GradientButton: GradientButton,
};

const styles = StyleSheet.create({
  root: {
    padding: 16,
    borderRadius: 5,
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  solid: {
    backgroundColor: colors.terciary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.terciary,
    fontWeight: '900',
  },
  variantText: {
    fontWeight: '700',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  destructive: {
    color: '#FF0000',
  },
  loadingContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
