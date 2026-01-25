import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { CaretDown, CaretUp } from '@/components/icons';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { NumberInput } from '@/components/forms';
import { ThemedText } from '@/components/ThemedText';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Button } from '@/components/button';
import { IOddSheetData } from '../types';
import { useRepriceOdd } from '@/services';


interface TeamProps {
  name: string;
  score: number;
  onScoreChange: (score: number) => void;
}

const Team = ({ name, score, onScoreChange }: TeamProps) => {
  const scoreRef = useRef<number>(score);

  const inputStatus = useMemo(() => {
    const isIncreasing = score > scoreRef.current;
    const isDecreasing = score < scoreRef.current;
    const status: 'success' | 'error' | undefined = isIncreasing ? 'success' : isDecreasing ? 'error' : undefined;
    return { status, isIncreasing, isDecreasing };
  }, [score]);

  useEffect(() => {
    onScoreChange(scoreRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={teamStyle.root}>
      <View style={teamStyle.teamInfo}>

        <View style={{
          flexDirection: 'row',
          gap: 6,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <ThemedText style={teamStyle.teamScore}>{scoreRef.current}</ThemedText>
            {inputStatus?.isIncreasing && <CaretUp width={10} height={10} color="#3CC5A4" />}
            {inputStatus?.isDecreasing && <CaretDown width={10} height={10} color="#F80069" />}
          </View>
          <ThemedText
            ellipsizeMode="tail"
            style={teamStyle.teamName}
            className="team-name"
          >
            {name}
          </ThemedText>
        </View>
      </View>

      <NumberInput
        min={0}
        value={score}
        status={inputStatus?.status}
        onChange={onScoreChange}
      />
    </View>
  );
};


const teamStyle = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamName: {
    fontSize: 14,
  },
  teamScore: {
    fontWeight: '700',
    color: '#F3CA41',
  },
});

export const OddRepriceSheet = ({ visible = false }: ISheet) => {
  const { match, closeAll, currentSheet, goBack } = useMatchBottomSheet();
  const odd = currentSheet?.data as IOddSheetData;
  const description = odd.criterion?.name ?? 'Odd';

  const [oddValue, setOddValue] = useState<number>(odd.value);


  const { mutateAsync: repriceOdd, isPending } = useRepriceOdd();

  const handleUpdateOdd = async () => {
    await repriceOdd({
      oddId: odd.id,
      matchId: match.id,
      variables: { value: oddValue },
    });

    closeAll();
  };


  return (
    <BottomSheet
      onClose={closeAll} visible={visible} closeOnTouchBackdrop={false}
    >
      <BottomSheet.Header
        onClose={closeAll}
        onPrevious={() => goBack()}
        title={odd.name} description={description}
      />

      <SafeHorizontalView style={{ flexDirection: 'column', gap: 24 }}>
        <Team name={odd.name} score={oddValue} onScoreChange={(value) => setOddValue(value)} />
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>
        <Button.Root onPress={handleUpdateOdd} disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button.Root>
      </SafeHorizontalView>

    </BottomSheet>
  );
};
