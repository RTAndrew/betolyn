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
  criterion: 'O mercado foi cancelado',
  odd: 'A odd foi cancelada',
  match: 'O evento foi cancelado',
};

const MAPPED_ENTITY_TYPE: Record<TEntityType, IEntityType> = {
  criterion: {
    name: 'Mercado',
    description: 'Isto vai cancelar o mercado e reembolsar todas as apostas relacionadas.',
    showNote: false,
  },
  odd: {
    name: 'Odd',
    description: 'Isto vai cancelar a odd selecionada e reembolsar todas as apostas relacionadas.',
    showNote: true,
  },
  match: {
    name: 'Evento',
    description: 'Isto vai cancelar o evento e reembolsar todas as apostas feitas nele.',
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
          loadingTitle: 'A carregar',
          errorTitle: 'Aconteceu algo inesperado',
          successMessage: '',
          fnPromise: async () => handleVoid(),
          onSuccessClose: () => {
            closeAll();
          },
        },
      });
    }, 0);
  };

  return (
    <BottomSheet id={`cancelAndRefund-${sheetData?.id}`} onClose={closeAll} visible={visible}>
      <BottomSheet.Header
        title={`Cancelar e reembolsar - ${data.name}`}
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
            title="O risco será recalculado!"
            description="Pode ser necessário adicionar fundos ou ajustar os limites de risco para concluir a operação."
          />
        )}

        <TextInput
          multiline
          style={{ backgroundColor: colors.greyLight }}
          numberOfLines={4}
          label="Motivo do cancelamento (será visível para os utilizadores)"
          placeholder="Odds incorretas, evento cancelado, erro de dados, etc."
          value={reason}
          onChangeText={setReason}
        />

        <Button.Root disabled={!canSubmit} onPress={onSubmit} style={styles.updateScoreButton}>
          Confirmar e reembolsar
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
