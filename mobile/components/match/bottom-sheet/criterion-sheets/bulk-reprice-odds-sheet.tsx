import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { CaretDown, CaretUp } from '@/components/icons';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { NumberInput } from '@/components/forms';
import { ThemedText } from '@/components/ThemedText';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Button } from '@/components/button';
import { useRepriceCriterionOdds } from '@/services';

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

interface IOddValue {
  [key: string]: number;
}

export const CriterionBulkRepriceOddsSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet, goBack, match } = useMatchBottomSheet();
  const { mutateAsync: repriceOdds, isPending } = useRepriceCriterionOdds();

  const [oddValues, setOddValues] = useState<IOddValue>({});

  const handleOddValueChange = (oddId: string, value: number) => {
    setOddValues((prev) => ({ ...prev, [oddId]: value }));
  };

  const criterion = currentSheet?.data as IMatchCriteriaResponse;
  if (!criterion) throw new Error('Criterion not found');

  const handleSave = async () => {

    const oddsDTO = criterion.odds.map((odd) => ({
      id: odd.id,
      value: oddValues[odd.id] ?? odd.value,
    }));

    await repriceOdds(
      {
        criterionId: criterion.id.toString(),
        matchId: match.id,
        variables: {
          odds: oddsDTO,
        },
      },
      {
        onSuccess: () => {
          closeAll();
        },
      }
    );
  };

  return (
    <BottomSheet
      onClose={closeAll} visible={visible} closeOnTouchBackdrop={false}
    >
      <BottomSheet.Header
        onClose={closeAll}
        onPrevious={() =>
          goBack()}
        title={criterion.name} description={"Criterion"}
      />

      <SafeHorizontalView style={{ flexDirection: 'column', gap: 24 }}>
        {criterion.odds.map((odd) => (
          <Team key={odd.id} name={odd.name} score={oddValues?.[odd.id] ?? odd.value} onScoreChange={(value) => handleOddValueChange(odd.id, value)} />
        ))}
      </SafeHorizontalView>

      <SafeHorizontalView  style={{ marginTop: 32 }}>
        <Button.RootButton onPress={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button.RootButton>
      </SafeHorizontalView>

    </BottomSheet>
  );
};
