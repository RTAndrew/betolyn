import { IOdd } from '@/types';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useMatchBottomSheet } from '../match/bottom-sheet';
import { IOddSheetData } from '../match/bottom-sheet/types';

interface OddButtonProps extends TouchableOpacityProps {
  odd: IOdd;
  showName?: boolean;
  variant?: 'primary' | 'secondary';
  criterion?: IOddSheetData['criterion'];
}

export const OddButton = ({
  odd,
  style,
  showName = true,
  criterion,
  variant = 'primary',
  ...props
}: OddButtonProps) => {
  const { pushSheet } = useMatchBottomSheet();

  const oddSheetData: IOddSheetData = {
    ...odd,
    criterion,
  };

  return (
    <TouchableOpacity
      onLongPress={() => {
        pushSheet({ type: 'odd-action', data: oddSheetData });
      }}
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
        {!showName && <Text style={oddsStyles.oddText}>{odd.value}</Text>}

        {showName && (
          <>
            <Text style={[oddsStyles.oddText, { fontSize: 12 }]}>{odd.name}</Text>
            <Text style={oddsStyles.oddText}>({odd.value})</Text>
          </>
        )}
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
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
