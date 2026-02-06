import React, { useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Button } from '@/components/button';
import { useCreateOdd } from '@/services';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { NumberInput } from '@/components/forms';
import Checkbox from '@/components/forms/switch';

type ValidationSuccess = { success: true; name: string; value: number };
type ValidationFailure = { success: false; nameError: string | null; valueError: string | null };
type ValidationResult = ValidationSuccess | ValidationFailure;

function validateCreateOddForm(name: string | null, value: string | null): ValidationResult {
  let nameError: string | null = null;
  let valueError: string | null = null;

  // Name: required, non-empty after trim (covers null, '', whitespace-only)
  const trimmedName = (name ?? '').trim();
  if (trimmedName.length === 0) {
    nameError = 'Name is required';
  }

  // Value: required, must be a finite number > 0
  const trimmedValue = (value ?? '').trim();
  if (trimmedValue.length === 0) {
    valueError = 'Odds value is required';
  } else {
    const parsed = parseFloat(trimmedValue);
    if (!Number.isFinite(parsed)) {
      valueError = 'Odds value must be a valid number';
    } else if (parsed <= 0) {
      valueError = 'Odds value must be greater than 0';
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
    return <>Error: No criterion data found</>;
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
        title="New Outcome"
        description={criterion.name}
        onClose={closeAll}
      />

      <SafeHorizontalView style={{ flexDirection: 'column', gap: 24 }}>
        <TextInput
          label="Name"
          placeholder="e.g. Real Madrid"
          value={name ?? ''}
          onChangeText={setName}
          errorMessage={nameError}
        />

        <NumberInput
          label="Outcome value"
          value={Number(value ?? 0)}
          onChange={(value) => setValue(value.toString())}
          errorMessage={valueError}
        />

        <Checkbox
          label="Create as a draft?"
          description="Draft outcomes are not visible to users until they are published."
          value={isDraft}
          onChange={setIsDraft}
        />
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>
        <Button.Root onPress={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};
