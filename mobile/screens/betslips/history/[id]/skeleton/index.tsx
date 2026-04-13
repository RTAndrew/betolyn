import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { Settings } from '@/components/settings';
import { Skeleton } from '@/components/skeleton';
import { colors } from '@/constants/colors';

import { skeletonStyles as styles } from './styles';

export function BetSlipIdScreenSkeleton() {
  const groupTitleSkeleton = (width: number) => (
    <Skeleton borderRadius={4} style={{ width, height: 14, flexGrow: 0 }} />
  );
  const rowTitle = (
    <Skeleton borderRadius={4} style={{ width: '72%', maxWidth: 200, height: 16, flexGrow: 0 }} />
  );
  const rowValue = <Skeleton borderRadius={4} style={{ width: 88, height: 16, flexGrow: 0 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.greyMedium }}>
      <StatusBar style="light" />
      <ScrollView style={{ flex: 1 }} stickyHeaderIndices={[0]} contentContainerStyle={styles.root}>
        <ScreenHeader
          style={{ backgroundColor: 'transparent' }}
          iconContainerColor={colors.greyMedium}
          type="back"
          onClose={() => router.back()}
        />
        <View style={{ backgroundColor: colors.greyLight }}>
          <SafeHorizontalView style={styles.transaction}>
            <Skeleton borderRadius={8} style={{ width: 220, height: 44, flexGrow: 0 }} />
          </SafeHorizontalView>
        </View>

        <SafeHorizontalView style={styles.transactionBody}>
          <Settings.ItemGroup title={groupTitleSkeleton(56)}>
            <Settings.Item title={rowTitle} description={rowValue} suffixIcon={false} />
            <Settings.Item title={rowTitle} description={rowValue} suffixIcon={false} />
          </Settings.ItemGroup>

          <Settings.ItemGroup title={groupTitleSkeleton(40)}>
            <Settings.Item title={rowTitle} description={rowValue} suffixIcon={false} />
            <Settings.Item title={rowTitle} description={rowValue} suffixIcon={false} />
            <Settings.Item title={rowTitle} description={rowValue} suffixIcon={false} />
          </Settings.ItemGroup>
        </SafeHorizontalView>
      </ScrollView>
    </View>
  );
}
