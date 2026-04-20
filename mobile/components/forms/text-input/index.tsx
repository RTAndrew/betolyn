import { useMemo, useState } from 'react';
import { TextInput as _TextInput, StyleSheet, TextInputProps, TextStyle } from 'react-native';

import { colors } from '@/constants/colors';

import BaseField, { BaseFieldProps } from '../base-field';

interface InputProps extends TextInputProps, Omit<BaseFieldProps, 'children'> {
  style?: TextStyle;
}

const TextInput = ({
  label,
  errorMessage,
  status,
  style,
  containerStyle,
  multiline,
  numberOfLines = 4,
  ...props
}: InputProps) => {
  const errorColor = useMemo(() => {
    if (status) return errorStyles[status];
    if (errorMessage) return errorStyles.error;
    return undefined;
  }, [status, errorMessage]);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <BaseField
      label={label}
      errorMessage={errorMessage}
      status={status}
      containerStyle={containerStyle}
    >
      <_TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor="#BFBFBF"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          multiline && {
            ...styles.multiline,
            ...(numberOfLines && { height: numberOfLines * 20 }),
          },
          errorColor,
          isFocused && styles.focused,
          style,
        ]}
      />
    </BaseField>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    color: colors.white,
    borderColor: '#8791A5',
    backgroundColor: colors.greyMedium,
  },
  /** iOS ignores numberOfLines for height; minHeight makes multiline usable as a textarea on both platforms. */
  multiline: {
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: colors.terciary,
  },
});

const errorStyles = StyleSheet.create({
  warning: {
    borderColor: '#FA8C16',
  },
  error: {
    borderColor: colors.secondary,
  },
  success: {
    borderColor: colors.primary,
  },
});

export default TextInput;
