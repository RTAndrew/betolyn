import React, { useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { Pressable, StyleSheet, View } from 'react-native';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { ThemedText } from '@/components/ThemedText';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Button } from '@/components/button';
import { Checkbox } from 'react-native-ui-lib';
interface TeamProps {
  name: string;
  score: number;
  isSelected: boolean;
  onValueChange: (isSelected: boolean) => void;
}

const Team = ({ name, score, isSelected, onValueChange }: TeamProps) => {

  return (
    <View style={teamStyle.root}>
      <View style={teamStyle.teamInfo}>

        <View style={{
          flexDirection: 'row',
          gap: 6,
        }}>

          <ThemedText style={teamStyle.teamScore}>{score}</ThemedText>

          <ThemedText
            ellipsizeMode="tail"
            style={teamStyle.teamName}
            className="team-name"
          >
            {name}
          </ThemedText>
        </View>
      </View>

      <Checkbox borderRadius={100} iconColor='white' color='#3CC5A4' value={isSelected} onValueChange={(value) => onValueChange(value)} style={checkboxStyle.root} />

    </View>
  );
};

const checkboxStyle = StyleSheet.create({
  root: {

  },
});


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
  [key: string]: boolean;
}

export const CriterionLockAndResultSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet, goBack } = useMatchBottomSheet();

  const [oddValues, setOddValues] = useState<IOddValue>({});


  const handleOddValueChange = (oddId: string, value: boolean) => {
    setOddValues((prev) => ({ ...prev, [oddId]: value }));
  };

  if (!currentSheet?.data) throw new Error('No criterion data found');

  const criterion = currentSheet?.data as IMatchCriteriaResponse;

  return (
    <BottomSheet
      closeOnTouchBackdrop={false}
      onClose={closeAll} visible={visible}
    >
      <BottomSheet.Header
        onClose={closeAll}
        onPrevious={() =>
          goBack()}
        title={criterion.name} description={"Lock & Result"}
      />

      <SafeHorizontalView style={{ flexDirection: 'column'}}>
        {criterion.odds.map((odd) => (
          <Pressable style={{ paddingVertical: 12 }} key={odd.id} onPress={() => handleOddValueChange(odd.id, !(oddValues?.[odd.id] ?? false))}>
            <Team onValueChange={(value) => handleOddValueChange(odd.id, value)} name={odd.name} score={odd.value} isSelected={oddValues?.[odd.id] ?? false} />
          </Pressable>
        ))}
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>
        <Button.GradientButton onPress={closeAll}>Save</Button.GradientButton>
      </SafeHorizontalView>

    </BottomSheet>
  );
};
