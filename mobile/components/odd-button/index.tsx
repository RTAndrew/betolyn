import { IOdd } from '@/mock/matches';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';

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
      <Text style={oddsStyles.oddText}>{odd.value}</Text>
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
