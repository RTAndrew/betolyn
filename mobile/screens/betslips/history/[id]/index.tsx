import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import BetCard from '@/components/bet-card';
import EmptyState from '@/components/empty-state';
import { MoneyHand } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetBetSlipItemById } from '@/services';
import { getBetSlipItemStatusTag } from '@/utils/get-entity-status-tag';
import { formatKwanzaAmount, formatOddValue } from '@/utils/number-formatters';

import BetSlipItemOddReference from './betslip-item-odd-reference';
import { BetSlipIdScreenSkeleton } from './skeleton';

interface BetSlipIdScreenProps {
  id: string;
  type: 'single' | 'multiple';
}

const Root = (props: { children: React.ReactNode; backgroundColor?: string }) => {
  return (
    <View style={{ flex: 1, backgroundColor: props.backgroundColor ?? colors.greyMedium }}>
      <StatusBar style="light" />

      <ScrollView style={{ flex: 1 }} stickyHeaderIndices={[0]} contentContainerStyle={styles.root}>
        <ScreenHeader
          style={{ backgroundColor: 'transparent' }}
          iconContainerColor={colors.greyMedium}
          type="back"
          onClose={() => router.back()}
        />
        {props.children}
      </ScrollView>
    </View>
  );
};

const BetSlipIdScreen = ({ id, type }: BetSlipIdScreenProps) => {
  const { data, isPending } = useGetBetSlipItemById({ id });
  const bet = data?.data;

  if (isPending) {
    return <BetSlipIdScreenSkeleton />;
  }

  if (!bet) {
    return (
      <Root backgroundColor={colors.greyLight}>
        <EmptyState.NoSearch center title="Bet not found" description="" />
      </Root>
    );
  }

  return (
    <Root>
      <View style={{ backgroundColor: colors.greyLight }}>
        <SafeHorizontalView style={styles.transaction}>
          <View style={styles.iconContainer}>
            <MoneyHand width={32} height={32} />
          </View>
          <ThemedText style={styles.amount}>
            {formatKwanzaAmount(bet?.potentialPayout ?? 0)}
          </ThemedText>
          {getBetSlipItemStatusTag(bet?.status ?? 'PENDING')}
        </SafeHorizontalView>
      </View>

      <SafeHorizontalView style={styles.transactionBody}>
        <Settings.ItemGroup>
          <Settings.Item title="Type" suffixIcon={false} description={type.toUpperCase()} />
          <Settings.Item title="Created At" suffixIcon={false} description={bet.createdAt} />
        </Settings.ItemGroup>

        <Settings.ItemGroup title="Bet">
          <Settings.Item
            title="Odd Value"
            suffixIcon={false}
            description={formatOddValue(bet.oddValueAtPlacement)}
          />
          <Settings.Item
            title="Amount"
            suffixIcon={false}
            description={formatKwanzaAmount(bet.stake)}
          />
          <Settings.Item
            title="Payout"
            suffixIcon={false}
            description={formatKwanzaAmount(bet.potentialPayout)}
          />
        </Settings.ItemGroup>

        <BetSlipItemOddReference oddId={bet.oddId} />

        {bet.match && (
          <Settings.ItemGroup title="Linked Reference" innerStyle={styles.linkedReference}>
            <SafeHorizontalView>
              <BetCard match={bet.match} disableControls />
            </SafeHorizontalView>
          </Settings.ItemGroup>
        )}
      </SafeHorizontalView>
    </Root>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    paddingBottom: 72,
    backgroundColor: colors.greyLight,
  },
  transaction: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 24,
  },
  amount: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.white,
  },
  iconContainer: {
    width: 72,
    height: 72,
    backgroundColor: colors.greyMedium,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionBody: {
    flexDirection: 'column',
    gap: 18,
    height: '100%',
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.greyMedium,
  },
  linkedReference: {
    backgroundColor: '#414A5C',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.greyLighter50,
  },
});

export default BetSlipIdScreen;
