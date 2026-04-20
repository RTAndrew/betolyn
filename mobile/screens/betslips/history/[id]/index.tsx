import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import BetCard from '@/components/bet-card';
import EmptyState from '@/components/empty-state';
import { MoneyHand } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { Settings } from '@/components/settings';
import Tag from '@/components/tags';
import { colors } from '@/constants/colors';
import TransactionScreenGeneric from '@/screens/me/transactions/transaction-screen-generic';
import { useGetBetSlipItemById } from '@/services';
import { IBetSlipItem } from '@/types';
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

const TransactionDetailsTab = ({
  bet,
  type,
}: {
  bet: IBetSlipItem;
  type: 'single' | 'multiple';
}) => {
  return (
    <View style={styles.transactionBody}>
      <Settings.ItemGroup>
        <Settings.Item title="Type" suffixIcon={false} description={type.toUpperCase()} />
        <Settings.Item title="Created At" suffixIcon={false} description={bet.createdAt} />
      </Settings.ItemGroup>

      <Settings.ItemGroup title="Bet">
        <Settings.Item
          title="Outcome Price"
          suffixIcon={false}
          description={formatOddValue(bet.oddValueAtPlacement)}
        />
        <Settings.Item
          title="Stake"
          suffixIcon={false}
          description={formatKwanzaAmount(bet.stake)}
        />
        <Settings.Item
          suffixIcon={false}
          description={
            bet.status === 'WON'
              ? formatKwanzaAmount(bet.potentialPayout - bet.stake)
              : formatKwanzaAmount(bet.potentialPayout)
          }
          title={bet.status == 'WON' ? 'Payout' : 'Potential Payout'}
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

      <TransactionScreenGeneric.TransactionId title="Bet ID" id={bet.id} />
    </View>
  );
};

const BetSlipIdScreen = ({ id, type }: BetSlipIdScreenProps) => {
  const { data, isPending, error } = useGetBetSlipItemById({ id });
  const bet = data?.data;

  const statusTag = useMemo(() => {
    if (bet?.status === 'WON') {
      const profit = (bet?.stake / bet?.potentialPayout) * 100;
      return <Tag.Active title={`Won +${profit.toFixed(0)}%`} />;
    }

    return getBetSlipItemStatusTag(bet?.status ?? 'PENDING');
  }, [bet]);

  if (isPending) {
    return <BetSlipIdScreenSkeleton />;
  }

  if (error || !bet) {
    return (
      <Root backgroundColor={colors.greyLight}>
        <EmptyState.NoSearch center title="Bet not found" description="" />
      </Root>
    );
  }

  return (
    <>
      <TransactionScreenGeneric
        isLoading={isPending}
        error={Boolean(error || !data)}
        header={{
          icon: MoneyHand,
          amount: bet.potentialPayout,
          tag: statusTag,
        }}
        tabs={[
          {
            id: 'details',
            title: 'Details',
            content: <TransactionDetailsTab bet={bet!} type={type} />,
          },
        ]}
      />
    </>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  linkedReference: {
    backgroundColor: '#414A5C',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.greyLighter50,
  },
});

export default BetSlipIdScreen;
