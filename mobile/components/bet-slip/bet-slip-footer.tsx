import { useSignals } from '@preact/signals-react/runtime';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-actions-sheet';

import { ButtonTab } from '@/components/button-tab';
import { NumberInput } from '@/components/forms';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { betSlipStore } from '@/stores/bet-slip.store';

import { Button } from '../button';
import SafeHorizontalView from '../safe-horizontal-view';

const BetSlipFooter = () => {
  useSignals();
  const { totalPotentialPayout, totalBets, totalStake, parlayStake, setParlayStake } = betSlipStore;
  const { betType, updateBetType } = betSlipStore;

  return (
    <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>
      <SafeHorizontalView style={styles.root}>
        <View style={styles.details}>
          <View style={{ flexDirection: 'column', gap: 10 }}>
            <ThemedText style={{ color: colors.greyLighter50 }} type="subtitle">
              Bets: {totalBets.value}
            </ThemedText>
            {betType.value === 'single' ? (
              <ThemedText style={{ color: colors.greyLighter50 }} type="subtitle">
                Stake: ${totalStake.value.toFixed(2)}
              </ThemedText>
            ) : (
              <ThemedText style={styles.amount}>
                ${totalPotentialPayout.value.toFixed(2)}
              </ThemedText>
            )}
          </View>

          {betType.value === 'single' ? (
            <ThemedText style={styles.amount}>${totalPotentialPayout.value.toFixed(2)}</ThemedText>
          ) : (
            <NumberInput value={parlayStake.value} onChange={setParlayStake} />
          )}
        </View>

        <ButtonTab
          style={styles.buttonTab}
          activeIndex={betType.value === 'single' ? 0 : 1}
          options={['Single', 'Parlay']}
          onIndexChange={(index) => updateBetType(index === 0 ? 'single' : 'parlay')}
        />
        <Button.Root
          disabled={totalPotentialPayout.value === 0}
          onPress={() => router.push('/betslips/placebet')}
        >
          Place Bet
        </Button.Root>
      </SafeHorizontalView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.complementary,
  },
  buttonTab: {
    marginVertical: 8,
  },
});

export default BetSlipFooter;
