import { router } from 'expo-router';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

import AuthenticationGuard from '@/components/auth-guard';
import EmptyState from '@/components/empty-state';
import { Add } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenWrapper from '@/components/screen-wrapper';
import { Skeleton } from '@/components/skeleton';
import SpaceCard from '@/components/space-card';
import { colors } from '@/constants/colors';
import { useGetAllSpaces } from '@/services';

export default function Spaces() {
  const { data, isPending, isRefetching, error, refetch } = useGetAllSpaces({});

  if (isPending) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight}>
        <SafeHorizontalView>
          <Skeleton.Group count={7} gap={12}>
            <SpaceCard.Skeleton />
          </Skeleton.Group>
        </SafeHorizontalView>
      </ScreenWrapper>
    );
  }

  if (error || !data) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight}>
        <EmptyState center title="Não foi possível processar o pedido" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container} scrollable={false} backgroundColor={colors.greyLight}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={data?.data}
        onRefresh={refetch}
        refreshing={isRefetching}
        contentContainerStyle={{ height: '100%' }}
        renderItem={({ item: space }) => (
          <SafeHorizontalView key={space.id}>
            <SpaceCard channel={space} />
          </SafeHorizontalView>
        )}
        ListEmptyComponent={<EmptyState.NoSearch center={{ includeTabBar: true }} />}
      />

      <AuthenticationGuard>
        <View style={styles.floatingButton}>
          <SafeHorizontalView>
            <Pressable
              onPress={() => router.push('/(modals)/spaces/create')}
              style={styles.createSpaceButton}
            >
              <Add />
            </Pressable>
          </SafeHorizontalView>
        </View>
      </AuthenticationGuard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.greyLight, flex: 1 },
  floatingButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 40,
    right: 0,
  },
  createSpaceButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    backgroundColor: colors.terciary,
    padding: 10,
    borderRadius: 100,
  },
  centered: {
    height: '100%',
    backgroundColor: 'red',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
