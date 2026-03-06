import { useSignals } from '@preact/signals-react/runtime';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { Eye, Trash } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { betSlipStore } from '@/stores/bet-slip.store';

import BetSlipCard from '../../../components/bet-slip/bet-slip-card';
import BetSlipFooter from '../../../components/bet-slip/bet-slip-footer';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 60;

const BetSlips = () => {
  useSignals();
  const { bets, clearSlip } = betSlipStore;

  return (
    <View style={styles.root}>
      <Pressable>
        <ScreenHeader safeArea title="Bet Slips">
          <ScreenHeader.QuickActions style={{ backgroundColor: colors.greyMedium }}>
            <ScreenHeader.Icon
              color="white"
              onPress={() => clearSlip()}
              style={{ backgroundColor: 'transparent' }}
            >
              <Trash color="white" />
            </ScreenHeader.Icon>
            <ScreenHeader.Icon
              color="white"
              onPress={() => router.push('/betslips/history')}
              style={{ backgroundColor: 'transparent' }}
            >
              <Eye color="white" />
            </ScreenHeader.Icon>
          </ScreenHeader.QuickActions>
        </ScreenHeader>
      </Pressable>

      <Button.Root loading>
        <ThemedText>History</ThemedText>
      </Button.Root>

      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          gap: 18,
          marginTop: 18,
          paddingBottom: Platform.OS === 'ios' ? 200 : 130,
        }}
        data={Object.keys(bets.value)}
        renderItem={({ item }) => {
          return (
            <SafeHorizontalView key={item} style={{ flex: 1, gap: 18 }}>
              <BetSlipCard matchId={item} bets={bets.value[item]} />
            </SafeHorizontalView>
          );
        }}
      />

      <View pointerEvents="box-none" style={[styles.sheetWrapper, { bottom: TAB_BAR_HEIGHT }]}>
        <BottomSheet
          isModal={false}
          backgroundInteractionEnabled
          gestureEnabled
          enableGesturesInScrollView
          closable={false}
          snapPoints={[Platform.OS === 'ios' ? 38 : 14, 100]}
          initialSnapIndex={0}
          containerStyle={styles.sheetContainer}
          indicatorStyle={styles.indicator}
        >
          <BetSlipFooter />
        </BottomSheet>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flex: 1,
    backgroundColor: colors.greyLight,
  },
  sheetWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9999,
  },
  sheetContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.greyDark,
    paddingVertical: 12,
  },
  indicator: {
    backgroundColor: colors.greyLight,
  },
});

export default BetSlips;
