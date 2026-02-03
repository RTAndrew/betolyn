import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSignals } from "@preact/signals-react/runtime";
import { betSlipStore } from '@/store/bet-slip'
import BetSlipCard from './bet-slip-card';
import { View } from 'react-native';
import { BetCard } from './bet-card';

const BetSlips = () => {
  useSignals();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#61687E' }}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText>Bet Slips</ThemedText>

        <View style={{ gap: 18 }}>
          {Object.keys(betSlipStore.value).map((key) => {
            return <BetSlipCard key={key} matchId={key}>
              {betSlipStore.value[key].map((bet, idx) =>
                <BetCard border={idx !== betSlipStore.value[key].length - 1} key={bet.oddId} bet={bet} />
              )}
            </BetSlipCard>
          })}
        </View>

        <ThemedText> {Math.random()}</ThemedText>
      </ThemedView>
    </SafeAreaView>
  )
}

export default BetSlips