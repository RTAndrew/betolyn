import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';

import { CreateSpaceEventWizardStepProps, IEventConfigurationFormData } from './utils';

type EventConfigurationProps = CreateSpaceEventWizardStepProps<'configuration'>;

type FieldKey = keyof IEventConfigurationFormData;

type FormErrors = Partial<Record<FieldKey, string>>;

const FIELD_LABELS: Record<FieldKey, string> = {
  homeTeam: 'Home team',
  awayTeam: 'Away team',
  startTime: 'Start time',
  endTime: 'End time',
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
        newErrors[key] = `Please, enter a value for ${FIELD_LABELS[key]}`;
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
      label: 'Next',
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
            label="Home team"
            value={formData.homeTeam}
            errorMessage={errors.homeTeam}
            placeholder="e.g. Team A"
            onChangeText={(text) => updateField('homeTeam', text)}
          />

          <TextInput
            label="Away team"
            value={formData.awayTeam}
            errorMessage={errors.awayTeam}
            placeholder="e.g. Team B"
            onChangeText={(text) => updateField('awayTeam', text)}
          />

          <TextInput
            label="Start time"
            value={formData.startTime}
            errorMessage={errors.startTime}
            placeholder="e.g. 2025-03-28T18:00:00Z"
            onChangeText={(text) => updateField('startTime', text)}
          />

          <TextInput
            label="End time"
            value={formData.endTime}
            errorMessage={errors.endTime}
            placeholder="e.g. 2025-03-28T20:00:00Z"
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
});
