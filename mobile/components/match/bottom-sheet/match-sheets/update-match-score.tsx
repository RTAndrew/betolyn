import BottomSheet from '@/components/bottom-sheet';
import React, { useMemo, useRef, useState } from 'react';
import { useMatchBottomSheet } from '../context';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ISheet } from '../index';
import { NumberInput } from '@/components/forms';
import { Button } from '@/components/button';
import { useUpdateMatchScore } from '@/services/matches/match-mutation';

interface TeamProps {
  name: string;
  imageUrl?: string;
  score: number;
  onScoreChange: (score: number) => void;
}

const Team = ({ name, imageUrl, score, onScoreChange }: TeamProps) => {
  const scoreRef = useRef<number>(score);
  const inputStatus = useMemo(() => {
    if (score === scoreRef.current) return undefined;
    return score < scoreRef.current ? 'error' : "success";
  }, [score]);

  return (
    <View style={teamStyle.root}>
      <View style={teamStyle.teamInfo}>
        <Image source={{ uri: imageUrl }} style={{ width: 42, height: 42 }} />
        <View style={{
          flexDirection: 'row',
          gap: 4,
        }}>
          <ThemedText
            ellipsizeMode="tail"
            style={teamStyle.teamName}
            className="team-name"
          >
            {name}
          </ThemedText>
          <ThemedText>({scoreRef.current})</ThemedText>
        </View>
      </View>

      <NumberInput
        value={score}
        status={inputStatus}
        onChange={onScoreChange}
        inputStyle={teamStyle.input}
        containerStyle={teamStyle.inputContainer}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#485164',
  },
  inputAction: {
    fontSize: 24,
  },
  input: {
    minWidth: 50,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    color: 'white',

    backgroundColor: '#61687E',
  },
});

type TTeamPosition = 'home' | 'away';

const UpdateMatchScoreSheet = ({ visible = false }: ISheet) => {
  const { closeAll, goBack, match } = useMatchBottomSheet();

  const [score, setScore] = useState<Record<TTeamPosition, number>>({
    home: match.homeTeamScore,
    away: match.awayTeamScore,
  });

  const { mutateAsync: MUTATION, isPending } = useUpdateMatchScore()

  const handleScoreChange = (team: `${TTeamPosition}`, newScore: number) => {
    if (isNaN(newScore)) return;
    if (newScore < 0) return;

    setScore((score) => ({ ...score, [team]: newScore }));
  };

  const handleSubmit = async () => {

    try {
      await MUTATION({
        matchId: match.id,
        variables: {
          awayTeamScore: score.away,
          homeTeamScore: score.home,
        },



      });
      closeAll();
    } catch (error) {
      console.error(error);
    }

  }


  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header title="Update Match Score" onClose={closeAll} onPrevious={goBack} />
      <BottomSheet.SafeHorizontalView style={styles.content}>
        <Team
          score={score.home}
          name={"Home"}
          imageUrl={match.homeTeam.badgeUrl}
          onScoreChange={(value) => handleScoreChange('home', value)}
        />
        <Team
          score={score.away}
          name={"Away"}
          imageUrl={match.awayTeam.badgeUrl}
          onScoreChange={(value) => handleScoreChange('away', value)}
        />

        <Button.GradientButton
          onPress={handleSubmit}
          style={styles.updateScoreButton}
        >
          {isPending ? '...' : 'Update Score'}
        </Button.GradientButton>
      </BottomSheet.SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    gap: 20,
  },
  updateScoreButton: {
    marginTop: 20,
  },
});

export default UpdateMatchScoreSheet;
