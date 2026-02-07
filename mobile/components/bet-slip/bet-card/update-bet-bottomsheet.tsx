import React, { useRef, useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { Image, StyleSheet, View } from 'react-native';
import { NumberInput } from '@/components/forms';
import { ThemedText } from '@/components/ThemedText';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { IOddWithCriterion } from '@/services';
import { IMatch } from '@/types';
import { Button } from '@/components/button';
import { betSlipStore } from '@/stores/bet-slip.store';

interface TeamProps {
  name: string;
  onScoreChange: (score: number) => void;
  oddValue: number;
  stake: number;
}

const TeamScore = ({
  name,
  imageUrl,
  direction = 'row',
}: {
  name: string;
  imageUrl: string;
  direction?: 'row' | 'row-reverse';
}) => {
  return (
    <View style={{ flexDirection: direction, alignItems: 'center', gap: 10 }}>
      <Image source={{ uri: imageUrl }} style={{ width: 30, height: 30 }} />
      <ThemedText style={styles.teamScoreName} className="team-name">
        {name}
      </ThemedText>
    </View>
  );
};

const Team = ({ name, onScoreChange, oddValue, stake }: TeamProps) => {
  const scoreRef = useRef<number>(oddValue);

  return (
    <View style={teamStyle.root}>
      <View style={teamStyle.teamInfo}>
        <View
          style={{
            flexDirection: 'row',
            gap: 6,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText style={teamStyle.teamScore}>{scoreRef.current}</ThemedText>
          </View>
          <ThemedText ellipsizeMode="tail" style={teamStyle.teamName} className="team-name">
            {name}
          </ThemedText>
        </View>
      </View>

      <NumberInput min={0} value={stake} onChange={onScoreChange} />
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

interface UpdateBetBottomsheetProps {
  odd: IOddWithCriterion;
  match: IMatch;
  visible: boolean;
  onClose: () => void;
  stake: number;
}

export const UpdateBetBottomsheet = ({
  visible = false,
  onClose,
  odd,
  match,
  stake: _stake,
}: UpdateBetBottomsheetProps) => {
  const [stake, setStake] = useState(_stake);
  const { editOddSlip, removeOddSlip } = betSlipStore;

  const handleSave = () => {
    editOddSlip(match.id, {
      oddId: odd.id,
      stake: stake,
    });

    onClose();
  };

  const handleRemove = () => {
    removeOddSlip(match.id, odd.id);
    onClose();
  };

  return (
    <BottomSheet onClose={onClose} visible={visible}>
      <BottomSheet.Header
        title={odd.criterion.name}
        description={
          <View style={styles.teamScore}>
            <TeamScore
              name={match.homeTeam.name}
              imageUrl={match.homeTeam.badgeUrl}
              direction="row-reverse"
            />
            <ThemedText style={styles.teamScoreValue} className="team-name">
              {match.homeTeamScore} : {match.awayTeamScore}
            </ThemedText>
            <TeamScore
              name={match.awayTeam.name}
              imageUrl={match.awayTeam.badgeUrl}
              direction="row"
            />
          </View>
        }
      />

      <SafeHorizontalView style={{ flexDirection: 'column', gap: 24 }}>
        <Team
          name={odd.name}
          oddValue={odd.value}
          onScoreChange={(value) => setStake(value)}
          stake={stake}
        />
      </SafeHorizontalView>

      <SafeHorizontalView style={styles.actions}>
        <Button.Root disabled={stake === _stake} onPress={handleSave}>
          Save
        </Button.Root>
        <Button.Root destructive variant="text" onPress={handleRemove}>
          Remove
        </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  actions: {
    marginTop: 32,
    gap: 12,
  },
  teamScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
  },
  teamScoreName: {
    fontSize: 12,
    color: '#C7D1E7',
  },
  teamScoreValue: {
    color: '#C7D1E7',
    fontWeight: '700',
  },
});
