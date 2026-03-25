import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Checkbox from 'react-native-ui-lib/src/components/checkbox';

import EmptyState from '@/components/empty-state';
import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetAllUsers } from '@/services/users/user-query';
import { IUser, IUserPublic } from '@/types';

import { CreateSpaceWizardStepProps } from './utils';

type InvitePeopleProps = CreateSpaceWizardStepProps<'invitation'>;

const GENERIC_AVATAR = require('@/assets/images/generic-user-profile-image.png');

const LIST_AVATAR_SIZE = 44;
const CHIP_AVATAR_SIZE = 28;

function toPublicUser(user: IUser): IUserPublic {
  return { id: user.id, email: user.email, username: user.username };
}

export const InvitePeople = ({ setNext, onChange, allData }: InvitePeopleProps) => {
  const [search, setSearch] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState(allData?.invitation ?? []);

  // TODO: Add pagination and do not show the current authenticated user
  const { data, isPending, isError } = useGetAllUsers({});
  const users = data?.data ?? [];

  const filteredUsers = useMemo(() => {
    const q = search?.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const toggleUser = useCallback((user: IUser) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.id === user.id)) {
        return prev.filter((m) => m.id !== user.id);
      }
      return [...prev, toPublicUser(user)];
    });
  }, []);

  const removeSelected = useCallback((userId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== userId));
  }, []);

  useEffect(() => {
    onChange(selectedMembers ?? []);

    setNext?.({
      label: selectedMembers.length > 0 ? 'Next' : 'Skip',
      variant: 'solid',
    });
  }, [selectedMembers]);

  const renderRow = useCallback(
    ({ item }: { item: IUser }) => {
      const checked = selectedMembers.some((m) => m.id === item.id);
      return (
        <SafeHorizontalView>
          <Pressable
            onPress={() => toggleUser(item)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.rowAvatarWrap}>
              <Image
                source={GENERIC_AVATAR}
                style={styles.avatarList}
                accessibilityIgnoresInvertColors
              />
            </View>
            <View style={styles.rowTextColumn}>
              <View style={styles.rowLabelRow}>
                <ThemedText style={styles.userName} numberOfLines={1}>
                  {item.username}
                </ThemedText>

                <Checkbox
                  value={checked}
                  borderRadius={100}
                  iconColor={colors.white}
                  onValueChange={() => toggleUser(item)}
                  color={checked ? colors.primary : '#8791A5'}
                />
              </View>
            </View>
          </Pressable>
        </SafeHorizontalView>
      );
    },
    [toggleUser, selectedMembers]
  );

  return (
    <View style={styles.root}>
      <SafeHorizontalView>
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setSearch}
          value={search ?? undefined}
          containerStyle={styles.searchField}
          placeholder="Search for username or email"
          style={{ backgroundColor: colors.greyLight }}
        />
      </SafeHorizontalView>

      {selectedMembers.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScrollContent}
          style={styles.chipsScroll}
        >
          {selectedMembers.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => removeSelected(u.id)}
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            >
              <Image
                source={GENERIC_AVATAR}
                style={styles.avatarChip}
                accessibilityIgnoresInvertColors
              />
              <ThemedText style={styles.chipLabel} numberOfLines={1}>
                {u.username} {u.email}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {isPending ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.greyLighter} size="large" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <EmptyState title="Could not load users." />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filteredUsers}
          renderItem={renderRow}
          extraData={selectedMembers}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <SafeHorizontalView style={styles.centered}>
              <EmptyState.NoSearch color={colors.greyLight} />
            </SafeHorizontalView>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  searchField: {
    marginBottom: 12,
  },
  chipsScroll: {
    maxHeight: 48,
    marginBottom: 12,
    paddingLeft: 16,
  },
  chipsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 30,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 5,
    paddingRight: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(199, 209, 231, 0.28)',
    maxWidth: 220,
  },
  chipPressed: {
    opacity: 0.85,
  },
  avatarChip: {
    width: CHIP_AVATAR_SIZE,
    height: CHIP_AVATAR_SIZE,
    borderRadius: CHIP_AVATAR_SIZE / 2,
  },
  chipLabel: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  rowPressed: {
    opacity: 0.92,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 52,
  },
  checkboxPressable: {
    justifyContent: 'center',
  },
  rowAvatarWrap: {
    justifyContent: 'center',
    paddingRight: 12,
  },
  avatarList: {
    width: LIST_AVATAR_SIZE,
    height: LIST_AVATAR_SIZE,
    borderRadius: LIST_AVATAR_SIZE / 2,
  },
  rowTextColumn: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(199, 209, 231, 0.35)',
  },
  rowLabelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 4,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  errorText: {
    color: colors.greyLighter,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.greyLighter50,
    textAlign: 'center',
  },
});
