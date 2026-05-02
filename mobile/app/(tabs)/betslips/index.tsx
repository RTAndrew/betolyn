import { useSignals } from '@preact/signals-react/runtime';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import EmptyState from '@/components/empty-state';
import { Eye, Trash } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { colors } from '@/constants/colors';
import { authStore } from '@/stores/auth.store';
import { betSlipStore } from '@/stores/bet-slip.store';

import BetSlipCard from '../../../components/bet-slip/bet-slip-card';
import BetSlipFooter from '../../../components/bet-slip/bet-slip-footer';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 70 : 60;

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
              disabled={!authStore.isLoggedIn.value}
              onPress={() => router.push('/betslips/history')}
              style={{ backgroundColor: 'transparent' }}
            >
              <Eye color="white" />
            </ScreenHeader.Icon>
          </ScreenHeader.QuickActions>
        </ScreenHeader>
      </Pressable>

      {Object.keys(bets.value).length > 0 ? (
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            gap: 18,
            marginTop: 18,
            paddingBottom: Platform.OS === 'ios' ? 220 : 180,
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
      ) : (
        <SafeHorizontalView>
          <View style={{ marginTop: 100 }}>
            <EmptyState.NoBets showButton={false} />
          </View>
        </SafeHorizontalView>
      )}

      <View pointerEvents="box-none" style={[styles.sheetWrapper, { bottom: TAB_BAR_HEIGHT }]}>
        <BottomSheet
          isModal={false}
          gestureEnabled
          closable={false}
          initialSnapIndex={0}
          enableGesturesInScrollView
          backgroundInteractionEnabled
          indicatorStyle={styles.indicator}
          containerStyle={styles.sheetContainer}
          snapPoints={[Platform.OS === 'ios' ? 50 : 16, 100]}
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
