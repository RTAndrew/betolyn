import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';

import { CreateSpaceEventWizardStepProps, IEventConfigurationFormData } from './utils';

type EventConfigurationProps = CreateSpaceEventWizardStepProps<'configuration'>;

type FieldKey = keyof IEventConfigurationFormData;

type FormErrors = Partial<Record<FieldKey, string>>;

const FIELD_LABELS: Record<FieldKey, string> = {
  homeTeam: 'equipa da casa',
  awayTeam: 'equipa visitante',
  startTime: 'hora de início',
  endTime: 'hora de fim',
};

const REQUIRED_FIELDS: FieldKey[] = ['homeTeam', 'awayTeam', 'startTime', 'endTime'];

export const EventConfigurationStep = ({
  data,
  onChange,
  setNext,
  goNext,
}: EventConfigurationProps) => {
  const formData: IEventConfigurationFormData = {
    endTime: data?.endTime ?? '',
    homeTeam: data?.homeTeam ?? '',
    awayTeam: data?.awayTeam ?? '',
    startTime: data?.startTime ?? '',
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const handleNextPress = useCallback(() => {
    const newErrors: FormErrors = {};

    for (const key of REQUIRED_FIELDS) {
      if (!formData[key].trim()) {
        newErrors[key] = `Introduza um valor para ${FIELD_LABELS[key]}`;
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onChange(formData);
    goNext();
  }, [formData, onChange, goNext]);

  useWizardPrimaryAction(handleNextPress);

  const updateField = (field: FieldKey, value: string) => {
    onChange({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    setNext?.({
      label: 'Próximo',
      variant: 'solid',
    });
  }, [setNext]);

  return (
    <ScrollView
      style={styles.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <SafeHorizontalView>
        <View style={styles.formContainer}>
          <TextInput
            label="Equipa da casa"
            style={styles.input}
            value={formData.homeTeam}
            errorMessage={errors.homeTeam}
            placeholder="ex.: Equipa A"
            onChangeText={(text) => updateField('homeTeam', text)}
          />

          <TextInput
            label="Equipa visitante"
            style={styles.input}
            value={formData.awayTeam}
            errorMessage={errors.awayTeam}
            placeholder="ex.: Equipa B"
            onChangeText={(text) => updateField('awayTeam', text)}
          />

          <TextInput
            label="Hora de início"
            style={styles.input}
            value={formData.startTime}
            errorMessage={errors.startTime}
            placeholder="ex.: 2025-03-28T18:00:00Z"
            onChangeText={(text) => updateField('startTime', text)}
          />

          <TextInput
            label="Hora de fim"
            style={styles.input}
            value={formData.endTime}
            errorMessage={errors.endTime}
            placeholder="ex.: 2025-03-28T20:00:00Z"
            onChangeText={(text) => updateField('endTime', text)}
          />
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
  formContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.greyLight,
  },
});
