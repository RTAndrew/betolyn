import {
  StyleSheet,
  TextInput as _TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { useMemo, useState } from 'react';
import BaseField, { BaseFieldProps } from '../input-field';

interface InputProps extends TextInputProps, Omit<BaseFieldProps, 'children'> {
  style?: TextStyle;
}

const TextInput = ({ label, errorMessage, status, style, containerStyle, ...props }: InputProps) => {
  const errorColor = useMemo(() => {
    if (status) return errorStyles[status];
    if (errorMessage) return errorStyles.error;
    return undefined;
  }, [status, errorMessage]);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <BaseField label={label} errorMessage={errorMessage} status={status} containerStyle={containerStyle}>
      <_TextInput
        {...props}
        placeholderTextColor="#BFBFBF"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.input, errorColor, isFocused && styles.focused, style]}
      />
    </BaseField>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
    borderColor: '#8791A5',
    backgroundColor: '#485164',
  },
  focused: {
    borderColor: '#7E87F1',
  },
});

const errorStyles = StyleSheet.create({
  warning: {
    borderColor: '#FA8C16',
  },
  error: {
    borderColor: '#F80069',
  },
  success: {
    borderColor: '#3CC5A4',
  },
});

export default TextInput;
