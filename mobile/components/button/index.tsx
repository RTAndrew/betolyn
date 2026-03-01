import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';

import { ThemedText } from '../ThemedText';

interface ButtonProps extends PropsWithChildren<TouchableOpacityProps> {
  variant?: 'solid' | 'outline' | 'text';
  destructive?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  color?: string;
}

export const GradientButton = ({ children, style, disabled, ...props }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity disabled={disabled} style={[disabled && styles.disabled]} {...props}>
      <LinearGradient
        colors={[colors.terciary, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.root, style]}
      >
        <Text style={styles.text}> {children} </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const NormalButton = ({
  children,
  style,
  disabled,
  variant = 'solid',
  color,
  destructive,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
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
          variant === 'text' && styles.variantText,
          color && { color },
          destructive && styles.destructive,
        ]}
      >
        {children}
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
});
