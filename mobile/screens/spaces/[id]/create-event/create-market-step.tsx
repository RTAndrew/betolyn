import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Switch from '@/components/forms/switch';
import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useWizardPrimaryAction, WizardComponentProps } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';

export interface IMarketConfigurationFormData {
  name: string;
  description: string;
  isDraft: boolean;
}

/** Minimal wizard state shape for this step when used standalone. */
interface ILegacyMarketWizardState {
  market?: IMarketConfigurationFormData;
}

type MarketProps = WizardComponentProps<IMarketConfigurationFormData, ILegacyMarketWizardState> & {
  showDraft?: boolean;
  validateForm?: boolean;
};

interface FormErrors {
  marketName?: string;
  description?: string;
}

export const CreateMarketStep = ({
  data,
  onChange,
  setNext,
  goNext,
  showDraft = true,
  validateForm = true,
}: MarketProps) => {
  const formData: IMarketConfigurationFormData = {
    name: data?.name ?? '',
    description: data?.description ?? '',
    isDraft: data?.isDraft ?? true,
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const handleNextPress = useCallback(() => {
    const newErrors: FormErrors = {};

    if (validateForm && !formData.name.trim()) {
      newErrors.marketName = 'Market name is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onChange(formData);
    goNext();
  }, [formData, onChange, goNext]);

  useWizardPrimaryAction(handleNextPress);

  const updateFormData = (field: keyof IMarketConfigurationFormData, value: string | boolean) => {
    onChange({
      ...formData,
      [field]: value,
    });
    if (errors[field as keyof FormErrors]) {
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
          <View style={{ marginBottom: 16 }}>
            <ThemedText style={{ color: colors.greyLighter }} type="default">
              Opt for shorter market names that are easier to view and understand (e.g. W, L, D,
              Home, Away).
            </ThemedText>
          </View>

          <TextInput
            label="Market name"
            value={formData.name}
            style={styles.input}
            errorMessage={errors.marketName}
            placeholder="e.g. Winner, loser, draw"
            onChangeText={(text) => updateFormData('name', text)}
          />

          <TextInput
            multiline
            numberOfLines={4}
            label="Description"
            textAlignVertical="top"
            value={formData.description}
            style={styles.descriptionInput}
            errorMessage={errors.description}
            onChangeText={(text) => updateFormData('description', text)}
            placeholder="Explain what this market is for, and avoid confusion when managing."
          />

          {showDraft && (
            <Switch
              value={formData.isDraft}
              label="Create as a draft?"
              onChange={(value) => updateFormData('isDraft', value)}
              description="Draft outcomes are not visible to users until they are published."
            />
          )}
        </View>
      </SafeHorizontalView>
    </ScrollView>
  );
};

export const CreateMarketStepForSpaces = (props: MarketProps) => {
  return <CreateMarketStep {...props} showDraft={false} validateForm={false} />;
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  descriptionInput: {
    height: 100,
    backgroundColor: colors.greyLight,
  },
  formContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.greyLight,
  },
});
