import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import BetCard from '@/components/bet-card';
import EmptyState from '@/components/empty-state';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Skeleton } from '@/components/skeleton';
import { MatchCardSkeleton } from '@/components/skeleton/match-card-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';
import { useGetMatches } from '@/services/matches/match-query';
import { IMatch } from '@/types';

import { CreateSpaceEventWizardStepProps } from './utils';

type SelectEventProps = CreateSpaceEventWizardStepProps<'selectEvent'>;

export const SelectEventStep = ({ data, onChange, setNext, goNext }: SelectEventProps) => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const { data: response, isPending, error } = useGetMatches({});
  const matches = response?.data ?? [];

  const filteredMatches = useMemo(() => {
    const q = searchQuery?.trim().toLowerCase();

    if (!q) return matches;
    return matches.filter(
      (m) => m.homeTeam.name.toLowerCase().includes(q) || m.awayTeam.name.toLowerCase().includes(q)
    );
  }, [matches, searchQuery]);

  const handleNextPress = useCallback(() => {
    if (!data?.id) {
      setListError('Select a match to continue');
      return;
    }

    setListError(null);
    onChange(data);
    goNext();
  }, [data, onChange, goNext]);

  useWizardPrimaryAction(handleNextPress);

  useEffect(() => {
    setNext?.({
      label: 'Next',
      variant: 'solid',
      visible: Boolean(data?.id),
    });
  }, [setNext, data]);

  const handleSelectMatch = (match: IMatch) => {
    onChange(match);
    if (listError) setListError(null);
  };

  if (isPending) {
    return (
      <SafeHorizontalView style={styles.flex}>
        <TextInput
          editable={false}
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor={colors.greyLighter50}
        />
        <Skeleton.Group count={6} gap={0}>
          <MatchCardSkeleton />
        </Skeleton.Group>
      </SafeHorizontalView>
    );
  }

  if (error || !response) {
    return (
      <SafeHorizontalView style={styles.flex}>
        <EmptyState.NoSearch
          center
          color={colors.greyLight}
          title="Could not load events."
          description="Please, try again later."
        />
      </SafeHorizontalView>
    );
  }

  return (
    <View style={styles.flex}>
      <SafeHorizontalView>
        <TextInput
          placeholder="e.g. Barcelona vs Real Madrid"
          value={searchQuery ?? ''}
          style={styles.searchInput}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.greyLighter50}
        />
      </SafeHorizontalView>

      {listError && (
        <ThemedText style={styles.listError} type="default">
          {listError}
        </ThemedText>
      )}

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState.NoSearch
            center
            color={colors.greyLight}
            title="No events found."
            description="Please, try a different search."
          />
        }
        renderItem={({ item }) => {
          const isSelected = data?.id === item.id;
          return (
            <View style={[isSelected && styles.cardSelected, { marginHorizontal: 6 }]}>
              <SafeHorizontalView>
                <BetCard
                  match={item}
                  showOdds={false}
                  disableControls
                  onPress={handleSelectMatch}
                />
              </SafeHorizontalView>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: colors.greyLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.greyLighter50,
    color: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  listError: {
    color: colors.secondary,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 120,
  },
  empty: {
    color: colors.greyLighter,
    paddingVertical: 24,
    textAlign: 'center',
  },
  cardSelected: {
    borderRadius: 20,
    backgroundColor: colors.greyLight,
  },
});
