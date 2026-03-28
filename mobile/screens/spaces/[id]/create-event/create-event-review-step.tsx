import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import type { TSpaceCreateEventType } from '@/types';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';
import { SpaceService, useCreateSpaceMatch } from '@/services';

import { CreateSpaceEventWizardStepProps } from './utils';

type ReviewProps = CreateSpaceEventWizardStepProps<'review'>;

export const CreateEventReviewStep = ({ allData, setNext }: ReviewProps) => {
  const createSpaceMatch = useCreateSpaceMatch();
  const { id: spaceId, eventType } = useLocalSearchParams<{
    id: string;
    eventType: string;
  }>();

  const summary = useMemo(() => {
    const match = allData.selectEvent;
    const configuration = allData.configuration;
    const risk = allData.risk?.maxReservedLiability;

    const matchLabel = match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : undefined;

    return {
      risk,
      matchLabel,
      homeTeam: configuration?.homeTeam,
      awayTeam: configuration?.awayTeam,
      startTime: configuration?.startTime,
      endTime: configuration?.endTime,
    };
  }, [allData]);

  const handleCreate = useCallback(() => {
    SheetManager.show('asyncProcessing', {
      payload: {
        successTitle: 'Event created',
        loadingTitle: 'Creating event',
        errorTitle: 'Error creating event',
        successMessage: 'Your event has been created successfully.',
        onSuccessClose: () => {
          SheetManager.hide('asyncProcessing');
          if (router.canGoBack()) {
            router.back();
          } else if (spaceId) {
            router.replace(`/spaces/${spaceId}`);
          } else {
            router.dismissAll();
          }
        },
        fnPromise: async () => {
          if (!spaceId) {
            throw new Error('Missing space id.');
          }
          const body = SpaceService.buildCreateSpaceMatchRequest(
            eventType as TSpaceCreateEventType | undefined,
            allData
          );
          const res = await createSpaceMatch.mutateAsync({ spaceId, variables: body });
          return res.data;
        },
      },
    });
  }, [allData, spaceId, eventType, createSpaceMatch]);

  useWizardPrimaryAction(handleCreate);

  useEffect(() => {
    setNext?.({
      label: 'Create event',
      variant: 'solid',
    });
  }, [setNext]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <SafeHorizontalView>
        <ThemedText style={styles.lead} type="default">
          Review your event details before creating it.
        </ThemedText>

        <View style={styles.block}>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Match
          </ThemedText>
          <ThemedText type="default">{summary.matchLabel ?? '—'}</ThemedText>
        </View>

        <View style={styles.block}>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Home team
          </ThemedText>
          <ThemedText type="default">{summary.homeTeam ?? '—'}</ThemedText>
        </View>

        <View style={styles.block}>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Away team
          </ThemedText>
          <ThemedText type="default">{summary.awayTeam ?? '—'}</ThemedText>
        </View>

        <View style={styles.block}>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Start time
          </ThemedText>
          <ThemedText type="default">{summary.startTime ?? '—'}</ThemedText>
        </View>

        <View style={styles.block}>
          <ThemedText style={styles.label} type="defaultSemiBold">
            End time
          </ThemedText>
          <ThemedText type="default">{summary.endTime ?? '—'}</ThemedText>
        </View>

        <View style={styles.block}>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Max reserved liability
          </ThemedText>
          <ThemedText type="default">{summary.risk ?? '—'}</ThemedText>
        </View>
      </SafeHorizontalView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  lead: {
    color: colors.greyLighter,
    marginBottom: 20,
  },
  block: {
    marginBottom: 16,
    gap: 4,
  },
  label: {
    color: colors.greyLighter50,
  },
});
