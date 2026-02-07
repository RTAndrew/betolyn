import { ICriterion, IOdd } from '@/types';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { useMatchBottomSheet } from '../match/bottom-sheet';
import { IOddSheetData } from '../match/bottom-sheet/types';
import { useGetOddById } from '@/services/odds/odd-query';
import { betSlipStore } from '@/stores/bet-slip.store';
import { useMemo } from 'react';
import { useSubscribeSlipOdd } from '@/stores/slip-store/use-subscribe-slip-odd';

interface OddButtonProps extends TouchableOpacityProps, Omit<OddBaseButtonProps, 'value' | 'name'> {
  odd: IOdd;
  criterion: Omit<ICriterion, 'match'>;
}

interface OddBaseButtonProps extends TouchableOpacityProps {
  variant?: 'outline' | 'solid' | 'default' | 'dashed';
  showValue?: boolean;
  showName?: boolean;
  value?: number;
  name: string;
  id?: string;
}

export const OddBaseButton = ({
  showValue = true,
  showName = true,
  value,
  name,
  variant = 'outline',
  style,
  ...rest
}: OddBaseButtonProps) => {
  // Just a wrapper to pass custom styles to the button
  const OddButtonComponent = ({
    style: customStyle,
    textStyle: customTextStyle,
  }: {
    style?: ViewStyle;
    textStyle?: TextStyle;
  }) => {
    return (
      <View
        style={[oddsStyles.oddButton, getDynamicOddStyles(variant).button, style, customStyle]}
        {...rest}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}
        >
          {!showName && (
            <Text style={[oddsStyles.oddText, getDynamicOddStyles(variant).text, customTextStyle]}>
              {value}
            </Text>
          )}

          {showName && (
            <>
              <Text
                style={[
                  oddsStyles.oddText,
                  { fontSize: 12 },
                  getDynamicOddStyles(variant).text,
                  customTextStyle,
                ]}
              >
                {name}
              </Text>
              {showValue && value && (
                <Text
                  style={[oddsStyles.oddText, getDynamicOddStyles(variant).text, customTextStyle]}
                >
                  ({value})
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  if (variant === 'default') {
    return (
      <View style={[oddsStyles.oddButton, disabledOddButtonStyles.root]} {...rest}>
        <OddButtonComponent
          style={disabledOddButtonStyles.wrapper}
          textStyle={disabledOddButtonStyles.text}
        />
      </View>
    );
  }

  return <OddButtonComponent />;
};

const disabledOddButtonStyles = StyleSheet.create({
  root: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    borderColor: '#55556E',
  },
  wrapper: {
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#55556E',
  },
  text: {
    color: '#C7D1E7',
    fontWeight: '600',
  },
});

interface IGetDynamicOddStyles {
  button: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
}

const getDynamicOddStyles = (variant: OddBaseButtonProps['variant']): IGetDynamicOddStyles => {
  if (variant === 'solid') {
    return {
      button: {
        ...oddsStyles.solid,
      },
      text: {
        ...oddsStyles.oddText,
        color: '#272F3D',
      },
    };
  }

  if (variant === 'outline') {
    return {
      button: {
        ...oddsStyles.outline,
      },
      text: {
        ...oddsStyles.oddText,
      },
    };
  }

  if (variant === 'dashed') {
    return {
      button: {
        ...oddsStyles.dashed,
      },
      text: {
        ...oddsStyles.oddText,
      },
    };
  }

  return {
    button: {
      ...oddsStyles.oddButton,
    },
    text: {
      ...oddsStyles.oddText,
    },
  };
};

export const OddButton = ({ style, criterion, variant, ...props }: OddButtonProps) => {
  const oddId = props.odd.id ?? '';
  const subscribeOdd = useSubscribeSlipOdd(oddId);
  const { addBetToSlip } = betSlipStore;
  const { match, pushSheet } = useMatchBottomSheet();

  const { data, isPending, error } = useGetOddById({ oddId: props.odd.id });
  const odd = data?.data;
  const isDisabled =
    odd?.status === 'SUSPENDED' || criterion.status === 'SUSPENDED' || odd?.status === 'DRAFT';

  const handleOnPress = () => {
    if (isDisabled || !odd) return;

    addBetToSlip(match.id, {
      oddId: oddId,
      stake: Number(Math.random().toFixed(2)),
      criterionId: criterion.id,
      oddAtPlacement: odd?.value,
    });
  };

  const handleOnLongPress = () => {
    pushSheet({ type: 'odd-action', data: oddSheetData });
  };

  const buttonVariant = useMemo(() => {
    if (isDisabled) return 'default';
    if (subscribeOdd) return 'solid';
    return variant;
  }, [isDisabled, subscribeOdd, variant]);

  if (isPending) return <Text> Loading... </Text>;
  if (error) {
    console.log('error fetching odd', error);
    return <></>;
  }
  if (!odd) return <Text> odd not found </Text>;

  const oddSheetData: IOddSheetData = {
    ...odd,
    criterion,
  };

  return (
    <Pressable
      delayLongPress={200}
      onLongPress={handleOnLongPress}
      onPress={handleOnPress}
      style={style}
      {...props}
    >
      <OddBaseButton
        variant={buttonVariant}
        value={odd.value}
        name={odd.name}
        style={style}
        {...props}
      />
    </Pressable>
  );
};

const oddsStyles = StyleSheet.create({
  oddButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F3C942',
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  solid: {
    backgroundColor: '#F3C942',
  },
  outline: {
    borderStyle: 'solid',
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: '#F3C942',
  },
  oddText: {
    color: '#F3C942',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
