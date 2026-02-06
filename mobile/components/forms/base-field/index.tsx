import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from '../../ThemedText';

export interface BaseFieldProps {
  label?: string;
  errorMessage?: string | null;
  status?: 'warning' | 'error' | 'success';
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

const BaseField = ({ label, errorMessage, status, children, containerStyle }: BaseFieldProps) => {
  const errorColor = errorMessage ? (status === 'error' ? '#FA8C16' : '#FF5CA0') : undefined;

  return (
    <View style={containerStyle}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {children}
      {errorMessage && (
        <ThemedText style={[styles.errorMessage, errorColor && { color: errorColor }]}>
          {errorMessage}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 5,
    color: '#F80069',
  },
});

export default BaseField;
