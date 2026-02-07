import { Button } from '@/components/button';
import { ButtonTab } from '@/components/button-tab';
import { NumberInput } from '@/components/forms';
import { ThemedText } from '@/components/ThemedText';
import { betSlipStore } from '@/stores/bet-slip.store';
import { useSignals } from '@preact/signals-react/runtime';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-actions-sheet';

const BetSlipFooter = () => {
  useSignals();
  const { totalPotentialPayout, totalBets, totatStake } = betSlipStore;
  const { betType, updateBetType } = betSlipStore;

  return (
    <ScrollView
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.root}
    >
      <View style={styles.details}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <ThemedText>Bets: {totalBets.value}</ThemedText>
          <ThemedText>Potential Payout: ${totalPotentialPayout.value.toFixed(2)}</ThemedText>
        </View>

        {betType.value === 'single' ? (
          <ThemedText style={styles.amount}> ${totatStake.value.toFixed(2)} </ThemedText>
        ) : (
          <NumberInput value={0} onChange={(value) => {}} />
        )}
      </View>

      <ButtonTab
        activeIndex={betType.value === 'single' ? 0 : 1}
        options={['Single', 'Parlay']}
        onIndexChange={(index) => updateBetType(index === 0 ? 'single' : 'parlay')}
      />
      <Button.Root> Place Bet </Button.Root>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 12,
    paddingHorizontal: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  amount: {
    fontSize: 40,
    color: '#F3CA41',
    fontWeight: '700',
  },
});

export default BetSlipFooter;
