import { IOdd } from '@/mock/matches';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

interface OddButtonProps extends ViewProps {
  odd: IOdd;
}

export const OddButton = ({ odd, style, ...props }: OddButtonProps) => {
  return (
    <View style={[oddsStyles.oddButton, style]} {...props}>
      <Text style={oddsStyles.oddText}>{odd.value}</Text>
    </View>
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
  oddText: {
    color: '#F3C942',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
