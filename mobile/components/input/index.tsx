import {
  StyleSheet,
  TextInput as _TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { useMemo, useState } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  errorMessage?: string | null;
  status?: 'warning' | 'error' | 'success';
  style?: TextStyle;
}

const TextInput = ({ label, errorMessage, status, style, ...props }: InputProps) => {
  const errorColor = useMemo(() => {
    if (status) return errorStyles[status];
    if (errorMessage) return errorStyles.error;
    return undefined;
  }, [status, errorMessage]);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <_TextInput
        {...props}
        placeholderTextColor="#BFBFBF"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.input, errorColor, isFocused && styles.focused, style]}
      />

      {errorMessage && (
        <ThemedText
          style={{ ...styles.errorMessage, color: status !== 'error' ? '#FF5CA0' : '#FA8C16' }}
        >
          {errorMessage}
        </ThemedText>
      )}
    </View>
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
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 5,
    color: '#F80069',
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
