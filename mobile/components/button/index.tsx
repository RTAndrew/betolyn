import React, { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends PropsWithChildren<TouchableOpacityProps> {
  disabled?: boolean;
  variant?: 'solid' | 'outline' | 'text';
  style?: ViewStyle;
}

export const GradientButton = ({ children, style, disabled, ...props }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity disabled={disabled} style={[disabled && styles.disabled]} {...props}>
      <LinearGradient
        colors={['#7E87F1', '#3CC5A4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.root, style]}
      >
        <Text style={styles.text}> {children} </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const NormalButton = ({ children, style, disabled, variant = 'solid', ...props }: ButtonProps) => {
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
      <Text style={[styles.text, variant === 'text' && styles.variantText]}> {children} </Text>
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
  },
  disabled: {
    opacity: 0.5,
  },
  solid: {
    backgroundColor: '#7E87F1',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#7E87F1',
    fontWeight: '900',
  },
  variantText: {
    fontWeight: '700',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
