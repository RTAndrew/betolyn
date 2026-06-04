import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Checkbox from 'react-native-ui-lib/src/components/checkbox';
import { useDebounceValue } from 'usehooks-ts';

import EmptyState from '@/components/empty-state';
import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { UserCard } from '@/components/user-card';
import { colors } from '@/constants/colors';

const GENERIC_AVATAR = require('@/assets/images/generic-user-profile-image.png');

const CHIP_AVATAR_SIZE = 28;

export interface ISearchUserData {
  id: string;
  title: string;
  imageUrl?: string;
}
export interface SearchAndAddUserProps {
  /** The ID used to identify the component and track Server-Cache */
  id: string;
  autoFocus?: boolean;
  searchPlaceholder?: string;
  style?: StyleProp<ViewStyle>;
  defaultSelectedMembers?: ISearchUserData[];
  onSelect: (members: ISearchUserData[]) => void;
  onSearch: (search: string) => Promise<ISearchUserData[]> | ISearchUserData[];
}

const NoSearchResults = ({ searchValue }: { searchValue: string }) => {
  return (
    <SafeHorizontalView style={styles.emptyState}>
      {searchValue.trim() ? (
        <EmptyState.NoSearch color={colors.greyLight} />
      ) : (
        <EmptyState.NoSearch
          description=""
          color={colors.greyLight}
          title="Digite o nome ou email que pretende para pesquisar."
        />
      )}
    </SafeHorizontalView>
  );
};

export function SearchAndAddUser({
  searchPlaceholder = 'Pesquisar pelo nome de utilizador ou email',
  defaultSelectedMembers = [],
  autoFocus = true,
  onSearch,
  onSelect,
  style,
  id,
}: SearchAndAddUserProps) {
  const [search, setSearch] = useDebounceValue<string | null>(null, 700);
  const [selectedMembers, setSelectedMembers] = useState<ISearchUserData[]>(defaultSelectedMembers);

  const searchEnabled = search !== null && !!search.trim();

  const {
    isError,
    data: users,
    isLoading: loading,
  } = useQuery({
    enabled: searchEnabled,
    queryKey: ['search-and-add-user', id, search],
    queryFn: async () => await onSearch(search ?? ''),
  });

  const toggleUser = useCallback((user: ISearchUserData) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.id === user.id)) {
        return prev.filter((m) => m.id !== user.id);
      }
      return [...prev, user];
    });
  }, []);

  const removeSelected = useCallback((id: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  useEffect(() => {
    onSelect(selectedMembers);
  }, [selectedMembers, onSelect]);

  const renderRow = useCallback(
    ({ item }: { item: ISearchUserData }) => {
      const checked = selectedMembers.some((m) => m.id === item.id);
      return (
        <SafeHorizontalView>
          <UserCard
            title={item.title}
            onPress={() => toggleUser(item)}
            avatarSource={GENERIC_AVATAR}
            suffix={
              <Checkbox
                value={checked}
                borderRadius={100}
                iconColor={colors.white}
                onValueChange={() => toggleUser(item)}
                color={checked ? colors.primary : '#8791A5'}
              />
            }
          />
        </SafeHorizontalView>
      );
    },
    [toggleUser, selectedMembers]
  );

  return (
    <View style={[styles.root, style]}>
      <SafeHorizontalView>
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus={autoFocus}
          onChangeText={setSearch}
          placeholder={searchPlaceholder}
          containerStyle={styles.searchField}
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
                {u.title}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.greyLighter} size="large" />
        </View>
      ) : isError ? (
        <View style={styles.emptyState}>
          <EmptyState title="Não foi possível carregar os utilizadores." />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderRow}
          extraData={selectedMembers}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<NoSearchResults searchValue={search ?? ''} />}
        />
      )}
    </View>
  );
}

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
  emptyState: {
    paddingVertical: 68,
  },
});
