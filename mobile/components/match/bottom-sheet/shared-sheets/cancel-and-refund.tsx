import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import AlertMessage from '@/components/alert-message';
import BottomSheet from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import TextInput from '@/components/forms/text-input';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { CriterionService, MatchesService, OddService } from '@/services';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

type TEntityType = 'criterion' | 'odd' | 'match';

interface IEntityType {
  name: string;
  description: string;
  showNote?: boolean;
}

interface ICancelRefundSheetData {
  id: string;
  name?: string;
  note?: {
    title: string;
    description?: string;
  };
  type: TEntityType;
}

const SUCCESS_TITLE: Record<TEntityType, string> = {
  criterion: 'The market was cancelled',
  odd: 'The outcome was cancelled',
  match: 'The match was cancelled',
};

const MAPPED_ENTITY_TYPE: Record<TEntityType, IEntityType> = {
  criterion: {
    name: 'Market',
    description: 'This will cancel the market and refund all related bets.',
    showNote: false,
  },
  odd: {
    name: 'Outcome',
    description: 'This will cancel the selected outcome and refund all related bets.',
    showNote: true,
  },
  match: {
    name: 'Event',
    description: 'This will cancel the match and refund all bets placed on it.',
    showNote: true,
  },
};

const CancelAndRefundSheet = ({ visible = false }: ISheet) => {
  const { closeAll, goBack, match, currentSheet } = useMatchBottomSheet();
  const [reason, setReason] = useState('');

  const sheetData = currentSheet?.data as ICancelRefundSheetData | undefined;
  const entityType = sheetData?.type ?? 'criterion';
  const note = sheetData?.note;
  const data = MAPPED_ENTITY_TYPE[entityType];
  const showNote = entityType !== 'match';

  const trimmedReason = reason.trim();
  const canSubmit = Boolean(sheetData?.id && trimmedReason);

  const handleVoid = async () => {
    if (!sheetData?.id || !trimmedReason) return;
    const variables = { reason: trimmedReason };

    if (entityType === 'criterion') {
      await CriterionService.void(sheetData?.id, variables);
      return;
    }

    if (entityType === 'odd') {
      await OddService.void(sheetData.id, variables);
      return;
    }

    await MatchesService.void(match.id, variables);
  };

  const onSubmit = () => {
    setTimeout(() => {
      SheetManager.show('asyncProcessing', {
        payload: {
          successTitle: SUCCESS_TITLE[entityType],
          loadingTitle: 'Loading',
          errorTitle: 'Something unexpected happened',
          successMessage: '',
          fnPromise: async () => handleVoid(),
          onSuccessClose: () => {
            SheetManager.hide('asyncProcessing');
            closeAll();
          },
        },
      });
    }, 0);
  };

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header
        title={`Cancel & Refund - ${data.name}`}
        description={sheetData?.name}
        onClose={closeAll}
        onPrevious={goBack}
      />
      <BottomSheet.SafeHorizontalView style={styles.content}>
        <ThemedText> {data.description}</ThemedText>

        {note && (
          <AlertMessage.Warning
            title={note.title}
            description={note.description}
            style={{ alignSelf: 'stretch', flexGrow: 1 }}
          />
        )}

        {showNote && (
          <AlertMessage.Warning
            style={{ alignSelf: 'stretch', flexGrow: 1 }}
            title="Risk will be recalculated!"
            description="You may need to add funds or adjust risk exposure limits."
          />
        )}

        <TextInput
          multiline
          style={{ backgroundColor: colors.greyLight }}
          numberOfLines={4}
          label="Reason for cancelation (it will be visible to users)"
          placeholder="Incorrect outcomes, event canceled, data error, etc."
          value={reason}
          onChangeText={setReason}
        />

        <Button.Root disabled={!canSubmit} onPress={onSubmit} style={styles.updateScoreButton}>
          Confirm and refund
        </Button.Root>
      </BottomSheet.SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    gap: 20,
  },
  updateScoreButton: {
    marginTop: 20,
    backgroundColor: colors.secondary,
  },
});

export default CancelAndRefundSheet;
