import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import BottomSheet, { BottomSheetProps } from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { NumberInput } from '@/components/forms';
import Switch from '@/components/forms/switch';
import TextInput from '@/components/forms/text-input';
import { OddBaseButton } from '@/components/odd-button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useWizardPrimaryAction, WizardComponentProps } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';
import { EOddStatus, IOdd } from '@/types';
import { randomUUID } from '@/utils/random-uuid';

export interface ISpaceEventOutcome extends Pick<IOdd, 'name' | 'value' | 'id'> {
  status: `${EOddStatus.ACTIVE}` | `${EOddStatus.DRAFT}`;
}

interface ILegacyOutcomesWizardState {
  outcomes?: Record<string, ISpaceEventOutcome>;
}

type OutcomesProps = WizardComponentProps<
  Record<string, ISpaceEventOutcome>,
  ILegacyOutcomesWizardState
>;

interface FormProps extends BottomSheetProps {
  outcome?: ISpaceEventOutcome;
  onSubmit: (data: ISpaceEventOutcome) => void;
  onRemove: (id: string) => void;
}

interface FormErrors {
  name?: string;
  value?: string;
}

const FormSheet = ({ onSubmit, visible = true, onClose, outcome, onRemove }: FormProps) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [name, setName] = useState(outcome?.name);
  const [value, setValue] = useState(outcome?.value ?? 0);
  const [isDraft, setIsDraft] = useState(outcome?.status === 'DRAFT' ? true : false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!value || value <= 0) {
      newErrors.value = 'Outcome value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOdd = () => {
    if (validateForm()) {
      onSubmit({
        id: outcome?.id ?? randomUUID(),
        name: name ?? '',
        value,
        status: isDraft ? EOddStatus.DRAFT : EOddStatus.ACTIVE,
      });
      setName('');
      setValue(0);
      setErrors({});
      onClose?.();
    }
  };

  const handleRemoveOdd = () => {
    if (!outcome?.id) return;
    onRemove(outcome.id);
    onClose?.();
  };

  const updateName = (text: string) => {
    setName(text);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const updateValue = (newValue: number) => {
    setValue(newValue);
    if (errors.value) {
      setErrors((prev) => ({ ...prev, value: undefined }));
    }
  };

  return (
    <BottomSheet gestureEnabled visible={visible} onClose={onClose} title="Add outcome">
      <SafeHorizontalView style={styles.formSheet}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={updateName}
          errorMessage={errors.name}
          placeholder="e.g. Home, Draw, Away"
          style={{ backgroundColor: colors.greyMedium }}
        />

        <NumberInput
          label="Outcome value"
          value={Number(value)}
          onChange={updateValue}
          errorMessage={errors.value}
        />

        <Switch
          value={isDraft}
          onChange={setIsDraft}
          label="Create as a draft?"
          description="Draft outcomes are not visible to users until they are published."
        />

        <Button.Root onPress={handleCreateOdd}>{outcome ? 'Update' : 'Add'}</Button.Root>
        {outcome && (
          <Button.Root variant="text" onPress={handleRemoveOdd}>
            Remove
          </Button.Root>
        )}
      </SafeHorizontalView>
    </BottomSheet>
  );
};

export const AddOutcomeStep = ({ data, onChange, setNext, goNext }: OutcomesProps) => {
  const outcomes = data ?? {};
  const [isFormVisible, setIsFormVisible] = useState<ISpaceEventOutcome | true | null>(null);
  const [listError, setListError] = useState<string | undefined>();

  useWizardPrimaryAction(() => {
    if (Object.keys(outcomes).length === 0) {
      setListError('Add at least one outcome');
      return;
    }
    setListError(undefined);
    onChange(outcomes);
    goNext();
  });

  useEffect(() => {
    setNext?.({
      label: 'Next',
      variant: 'solid',
    });
  }, [setNext]);

  const handleRemoveOutcome = (id: string) => {
    const next = { ...outcomes };
    delete next[id];
    onChange(next);
    if (Object.keys(next).length > 0) {
      setListError(undefined);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <SafeHorizontalView>
        {listError ? (
          <ThemedText style={styles.listError} type="default">
            {listError}
          </ThemedText>
        ) : null}

        <View style={styles.oddList}>
          <TouchableOpacity
            onPress={() => {
              setIsFormVisible(true);
            }}
          >
            <OddBaseButton name="Adicionar" variant="dashed" />
          </TouchableOpacity>

          {Object.values(outcomes ?? {}).map((outcome) => (
            <TouchableOpacity
              key={outcome.id}
              onPress={() => {
                setIsFormVisible(outcome);
              }}
            >
              <OddBaseButton
                name={outcome.name}
                value={outcome.value}
                variant={outcome.status === EOddStatus.DRAFT ? 'default' : 'outline'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </SafeHorizontalView>

      {isFormVisible && (
        <FormSheet
          onRemove={handleRemoveOutcome}
          outcome={typeof isFormVisible === 'object' ? isFormVisible : undefined}
          visible={true}
          onClose={() => setIsFormVisible(null)}
          onSubmit={(submitData) => {
            const newOutcomes = { ...outcomes, [submitData.id]: submitData };
            onChange(newOutcomes);
            setListError(undefined);
          }}
        />
      )}
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
  oddList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  formSheet: {
    flexDirection: 'column',
    gap: 24,
  },
  listError: {
    color: colors.secondary,
    marginBottom: 8,
  },
});
