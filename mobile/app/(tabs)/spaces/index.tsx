import { router } from 'expo-router';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthenticationGuard from '@/components/auth-guard';
import EmptyState from '@/components/empty-state';
import { Add } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Skeleton } from '@/components/skeleton';
import SpaceCard from '@/components/space-card';
import { colors } from '@/constants/colors';
import { useGetAllSpaces } from '@/services';

export default function Spaces() {
  const insets = useSafeAreaInsets();

  const { data, isPending, error } = useGetAllSpaces({});

  if (isPending) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView>
          <Skeleton.Group count={7} gap={12}>
            <SafeHorizontalView>
              <SpaceCard.Skeleton />
            </SafeHorizontalView>
          </Skeleton.Group>
        </ScrollView>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState title="We could not process your request" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={data?.data}
        renderItem={({ item: space }) => (
          <SafeHorizontalView key={space.id}>
            <SpaceCard channel={space} />
          </SafeHorizontalView>
        )}
        ListEmptyComponent={
          <SafeHorizontalView style={styles.centered}>
            <EmptyState.NoSearch />
          </SafeHorizontalView>
        }
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.greyLight, flex: 1 },
  floatingButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 150 : 100,
    right: 0,
  },
  createSpaceButton: {
    backgroundColor: colors.terciary,
    padding: 10,
    borderRadius: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
