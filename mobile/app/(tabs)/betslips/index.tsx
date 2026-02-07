import React from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { betSlipStore } from '@/stores/bet-slip.store';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import BetSlipFooter from '../../../components/bet-slip/bet-slip-footer';
import BottomSheet from '@/components/bottom-sheet';
import BetSlipCard from '../../../components/bet-slip/bet-slip-card';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 60;

const BetSlips = () => {
  useSignals();
  const { bets } = betSlipStore;

  return (
    <View style={styles.root}>
      <Pressable>
        <ScreenHeader safeArea title="Bet Slips" />
      </Pressable>

      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          gap: 18,
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
          onClose={() => {}}
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
    backgroundColor: '#61687E',
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
    backgroundColor: '#262F3D',
    paddingVertical: 12,
  },
  indicator: {
    backgroundColor: '#61687E',
  },
});

export default BetSlips;
