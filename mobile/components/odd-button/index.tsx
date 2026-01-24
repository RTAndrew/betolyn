import { ICriterion, IOdd } from '@/types';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useMatchBottomSheet } from '../match/bottom-sheet';
import { IOddSheetData } from '../match/bottom-sheet/types';
import { useGetOddById } from '@/services/odds/odd-query';

interface OddButtonProps extends TouchableOpacityProps {
  odd: IOdd;
  showName?: boolean;
  variant?: 'primary' | 'secondary';
  criterion: Omit<ICriterion, 'match'>;
}

interface OddWrapperProps extends TouchableOpacityProps, Pick<OddButtonProps, 'variant'> {
  children: React.ReactNode;
  sheetData: IOddSheetData;
}

const OddWrapper = ({ children, sheetData, variant, style, ...rest }: OddWrapperProps) => {
  const { pushSheet } = useMatchBottomSheet();


  return (
    <TouchableOpacity
      onLongPress={() => {
        pushSheet({ type: 'odd-action', data: sheetData });
      }}
      style={[
        oddsStyles.oddButton,
        variant === 'primary' ? oddsStyles.primaryVariant : oddsStyles.secondaryVariant,
        style,
      ]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

const DisabledOddButton = ({
  odd,
  showName = true,
  variant,
  sheetData,
}: OddButtonProps & { sheetData: IOddSheetData }) => {
  return (
    <OddWrapper sheetData={sheetData} variant={variant} style={[oddsStyles.oddButton, disabledOddButtonStyles.root]}>
      <View
        style={disabledOddButtonStyles.wrapper}
      >
        {!showName && <Text style={[oddsStyles.oddText, disabledOddButtonStyles.text]}>{odd.value}</Text>}

        {showName && (
          <>
            <Text style={[oddsStyles.oddText, disabledOddButtonStyles.text, { fontSize: 12 }]}>{odd.name}</Text>
            <Text style={[oddsStyles.oddText, disabledOddButtonStyles.text]}>({odd.value})</Text>
          </>
        )}
      </View>
    </OddWrapper>
  );
};

const disabledOddButtonStyles = StyleSheet.create({
  root: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderWidth: 0,
    backgroundColor: '#55556E',
    // opacity: 0.5,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderRadius: 96, // border radius(100) - padding(4) = 96
    borderColor: '#61687E',
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  text: {
    color: '#C7D1E7',
    fontWeight: "500"
  },
});

export const OddButton = (props: OddButtonProps) => {
  const { data, isPending, error } = useGetOddById({ oddId: props.odd.id });
  const odd = data?.data;


  if (isPending) return <Text> Loading... </Text>;
  if (error) { console.log("error fetching odd", error); return <></> }
  if (!odd) return <Text> odd not found </Text>

  const oddSheetData: IOddSheetData = {
    ...odd,
    criterion: props.criterion,
  };

  if (odd.status === 'SUSPENDED' || props.criterion.status === 'SUSPENDED') {
    return <DisabledOddButton sheetData={oddSheetData} {...props} odd={odd} />
  }

  const {
    style,
    showName = true,
    criterion,
    variant = 'primary',
    ...rest
  } = props;




  return (
    <OddWrapper sheetData={oddSheetData} variant={variant} style={style} {...rest}>
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
    </OddWrapper>
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
