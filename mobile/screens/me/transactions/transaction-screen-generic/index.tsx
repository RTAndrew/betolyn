import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { TabController } from 'react-native-ui-lib';

import EmptyState from '@/components/empty-state';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { BetSlipIdScreenSkeleton } from '@/screens/betslips/history/[id]/skeleton';
import { formatKwanzaAmount } from '@/utils/number-formatters';

const Root = (props: {
  children: React.ReactNode;
  backgroundColor?: string;
  refreshControl?: React.ComponentProps<typeof RefreshControl>;
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: props.backgroundColor ?? colors.greyMedium }}>
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.root}
        refreshControl={
          props.refreshControl ? <RefreshControl {...props.refreshControl} /> : undefined
        }
      >
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

interface ITab {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface TransactionScreenGenericProps {
  isLoading: boolean;
  error: boolean;
  refreshControl?: React.ComponentProps<typeof RefreshControl>;
  header: {
    icon?: React.ComponentType<SvgProps>;
    amount: number;
    tag: React.ReactNode;
  };
  tabs: ITab[];
}

const LinkedReference = ({ children }: PropsWithChildren) => {
  return (
    <Settings.ItemGroup title="Referência" innerStyle={styles.linkedReference}>
      {children}
    </Settings.ItemGroup>
  );
};

const TransactionId = ({ id, title = 'ID da transação' }: { id: string; title?: string }) => {
  // TODO: add copy to clipboard functionality
  return (
    <ThemedText style={styles.transactionId}>
      {title}: {id}
    </ThemedText>
  );
};

const TransactionScreenGeneric = ({
  isLoading,
  error,
  refreshControl,
  header,
  tabs,
}: TransactionScreenGenericProps) => {
  if (isLoading) {
    return <BetSlipIdScreenSkeleton />;
  }

  if (error) {
    return (
      <Root backgroundColor={colors.greyLight}>
        <EmptyState.NoSearch center title="Aposta não encontrada" description="" />
      </Root>
    );
  }

  return (
    <Root backgroundColor={colors.greyMedium} refreshControl={refreshControl}>
      <View style={{ backgroundColor: colors.greyLight }}>
        <SafeHorizontalView style={styles.transaction}>
          <View style={styles.iconContainer}>
            {header.icon && <header.icon width={32} height={32} />}
          </View>

          <ThemedText style={styles.amount}>{formatKwanzaAmount(header.amount)}</ThemedText>

          {typeof header.tag === 'string' ? (
            <ThemedText type="subtitle">{header.tag}</ThemedText>
          ) : (
            header.tag
          )}
        </SafeHorizontalView>
      </View>

      <TabController
        nestedInScrollView
        initialIndex={0}
        items={tabs.map((tab) => ({
          label: tab.title,
          key: tab.id,
          component: tab.content,
        }))}
      >
        {tabs.length > 1 && (
          <TabController.TabBar
            labelColor={colors.white}
            selectedLabelColor={colors.white}
            backgroundColor={colors.greyLight}
            indicatorStyle={{ backgroundColor: colors.white }}
          />
        )}

        <View style={styles.transactionBody}>
          {tabs.map((tab, idx) => (
            <TabController.TabPage index={idx} key={tab.id} lazy={idx !== 0}>
              <SafeHorizontalView>{tab.content}</SafeHorizontalView>
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
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
    fontSize: 32,
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
    flexGrow: 1,
    paddingVertical: 24,
    backgroundColor: colors.greyMedium,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  linkedReference: {
    backgroundColor: '#414A5C',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.greyLighter50,
  },
  transactionId: {
    fontSize: 14,
    marginTop: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.greyLighter50,
  },
});

TransactionScreenGeneric.LinkedReference = LinkedReference;
TransactionScreenGeneric.TransactionId = TransactionId;

export default TransactionScreenGeneric;
