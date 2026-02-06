import { ThemedText } from '@/components/ThemedText';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ICreateCriterionScreen, ICreateCriterionScreenRef } from './types';
import { OddBaseButton } from '@/components/odd-button';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { EOddStatus, IOdd } from '@/types';
import BottomSheet, { BottomSheetProps } from '@/components/bottom-sheet';
import TextInput from '@/components/forms/text-input';
import { NumberInput } from '@/components/forms';
import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import Switch from '@/components/forms/switch';
import { randomUUID } from '@/utils/random-uuid';

export interface ICreateCriterionOdds extends Pick<IOdd, 'name' | 'value' | 'id'> {
  status: `${EOddStatus.ACTIVE}` | `${EOddStatus.DRAFT}`;
}

interface FormProps extends BottomSheetProps {
  outcome?: ICreateCriterionOdds;
  onSubmit: (data: ICreateCriterionOdds) => void;
  onRemove: (id: string) => void;
}

interface FormErrors {
  name?: string;
  value?: string;
}

const FormSheet = ({ onSubmit, visible = true, onClose, outcome, onRemove }: FormProps) => {
  const [name, setName] = useState(outcome?.name ?? '');
  const [value, setValue] = useState(outcome?.value ?? 0);
  const [isDraft, setIsDraft] = useState(outcome?.status === 'DRAFT' ? true : false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
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
        name,
        value,
        status: isDraft ? EOddStatus.DRAFT : EOddStatus.ACTIVE,
      });
      setName('');
      setValue(0);
      setErrors({});
      onClose();
    }
  };

  const handleRemoveOdd = () => {
    if (!outcome?.id) return;
    onRemove(outcome.id);
    onClose();
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
        />

        <NumberInput
          label="Outcome value"
          value={Number(value)}
          onChange={updateValue}
          errorMessage={errors.value}
        />

        <Switch
          label="Create as a draft?"
          description="Draft outcomes are not visible to users until they are published."
          value={isDraft}
          onChange={setIsDraft}
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

const CreateCriterionOutcomes = forwardRef<
  ICreateCriterionScreenRef,
  ICreateCriterionScreen<Record<string, ICreateCriterionOdds>>
>(({ onDataCaptureNext, data }, ref) => {
  const [outcomes, setOutcomes] = useState<typeof data>(data);
  const [isFormVisible, setIsFormVisible] = useState<ICreateCriterionOdds | true | null>(null);

  const validateOutcomes = (): boolean => {
    if (Object.keys(outcomes).length === 0) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateOutcomes()) {
      onDataCaptureNext('outcomes', outcomes);
      return true;
    }

    return false;
  };

  const handleRemoveOutcome = (id: string) => {
    setOutcomes((prev) => {
      const newOutcomes = { ...prev };
      delete newOutcomes[id];

      onDataCaptureNext('outcomes', newOutcomes);
      return newOutcomes;
    });
  };

  useImperativeHandle(ref, () => ({
    handleNext,
  }));

  useEffect(() => {
    setOutcomes(data ?? {});
  }, [data]);

  return (
    <>
      <ThemedText type="title">Outcomes</ThemedText>

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

      {isFormVisible && (
        <FormSheet
          onRemove={handleRemoveOutcome}
          outcome={typeof isFormVisible === 'object' ? isFormVisible : undefined}
          visible={true}
          onClose={() => setIsFormVisible(null)}
          onSubmit={(data) => {
            setOutcomes((prev) => {
              const newOutcomes = { ...prev, [data.id]: data };
              onDataCaptureNext('outcomes', newOutcomes);
              return newOutcomes;
            });
          }}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  oddList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',

    gap: 12,
    marginTop: 20,
  },
  formSheet: {
    flexDirection: 'column',
    gap: 24,
  },
});

CreateCriterionOutcomes.displayName = 'CreateCriterionOutcomes';

export default CreateCriterionOutcomes;
