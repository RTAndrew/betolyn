import { IOdd } from '@/types';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface OddButtonProps extends TouchableOpacityProps {
  odd: IOdd;
  variant?: 'primary' | 'secondary';
}

export const OddButton = ({ odd, style, variant = 'primary', ...props }: OddButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        oddsStyles.oddButton,
        variant === 'primary' ? oddsStyles.primaryVariant : oddsStyles.secondaryVariant,
        style,
      ]}
      {...props}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}
      >
        <Text style={oddsStyles.oddText}>{odd.name}</Text>
        <Text style={oddsStyles.oddText}>({odd.value})</Text>
      </View>
    </TouchableOpacity>
  );
};

const oddsStyles = StyleSheet.create({
  oddButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F3C942',
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  primaryVariant: {
    borderStyle: 'solid',
  },
  secondaryVariant: {
    borderStyle: 'dashed',
  },
  oddText: {
    color: '#F3C942',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
