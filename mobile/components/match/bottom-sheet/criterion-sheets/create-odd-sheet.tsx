import React, { useState } from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { NumberInput } from '@/components/forms';
import Switch from '@/components/forms/switch';
import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useCreateOdd } from '@/services';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

type ValidationSuccess = { success: true; name: string; value: number };
type ValidationFailure = { success: false; nameError: string | null; valueError: string | null };
type ValidationResult = ValidationSuccess | ValidationFailure;

function validateCreateOddForm(name: string | null, value: string | null): ValidationResult {
  let nameError: string | null = null;
  let valueError: string | null = null;

  // Name: required, non-empty after trim (covers null, '', whitespace-only)
  const trimmedName = (name ?? '').trim();
  if (trimmedName.length === 0) {
    nameError = 'Nome obrigatório';
  }

  // Value: required, must be a finite number > 0
  const trimmedValue = (value ?? '').trim();
  if (trimmedValue.length === 0) {
    valueError = 'Preço da odd obrigatório';
  } else {
    const parsed = parseFloat(trimmedValue);
    if (!Number.isFinite(parsed)) {
      valueError = 'O preço da odd deve ser um número válido';
    } else if (parsed <= 0) {
      valueError = 'O preço da odd deve ser maior que 0';
    }
  }

  if (nameError !== null || valueError !== null) {
    return { success: false, nameError, valueError };
  }

  return {
    success: true,
    name: trimmedName,
    value: parseFloat(trimmedValue),
  };
}

export const CreateOddSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet, goBack } = useMatchBottomSheet();

  const [isDraft, setIsDraft] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [valueError, setValueError] = useState<string | null>(null);

  const { mutateAsync: createOdd, isPending } = useCreateOdd();

  if (!currentSheet?.data) {
    return <ThemedText>Nenhum mercado encontrado</ThemedText>;
  }

  const criterion = currentSheet.data as IMatchCriteriaResponse;

  const handleSave = async () => {
    setNameError(null);
    setValueError(null);

    const result = validateCreateOddForm(name, value);

    if (!result.success) {
      setNameError(result.nameError);
      setValueError(result.valueError);
      return;
    }

    await createOdd({
      variables: {
        name: result.name,
        value: result.value,
        criterionId: criterion.id,
        status: isDraft ? 'DRAFT' : 'ACTIVE',
      },
    });

    closeAll();
  };

  return (
    <BottomSheet onClose={closeAll} visible={visible} closeOnTouchBackdrop={false}>
      <BottomSheet.Header
        onPrevious={goBack}
        title="Nova odd"
        description={criterion.name}
        onClose={closeAll}
      />

      <SafeHorizontalView style={{ flexDirection: 'column', gap: 24 }}>
        <TextInput
          label="Nome"
          placeholder="ex.: Real Madrid"
          value={name ?? ''}
          onChangeText={setName}
          errorMessage={nameError}
        />

        <NumberInput
          label="Preço da odd"
          value={Number(value ?? 0)}
          onChange={(value) => setValue(value.toString())}
          errorMessage={valueError}
        />

        <Switch
          label="Criar como rascunho?"
          description="Odds em rascunho não ficam visíveis até serem publicadas."
          value={isDraft}
          onChange={setIsDraft}
        />
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>
        <Button.Root loading={isPending} onPress={handleSave}>
          Salvar
        </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};
