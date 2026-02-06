import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, View } from 'react-native';
import { useState, forwardRef, useImperativeHandle } from 'react';
import TextInput from '@/components/forms/text-input';
import Switch from '@/components/forms/switch';
import { ICreateCriterionScreen, ICreateCriterionScreenRef } from './types';

export interface IMarketConfigurationFormData {
  name: string;
  description: string;
  isDraft: boolean;
}

interface FormErrors {
  marketName?: string;
  description?: string;
}

const MarketConfiguration = forwardRef<
  ICreateCriterionScreenRef,
  ICreateCriterionScreen<IMarketConfigurationFormData>
>(({ data, onDataCaptureNext }, ref) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<IMarketConfigurationFormData>({
    name: data?.name ?? '',
    description: data?.description ?? '',
    isDraft: data?.isDraft ?? true,
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.marketName = 'Market name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onDataCaptureNext('market-configuration', formData);
      return true;
    }

    return false;
  };

  useImperativeHandle(ref, () => ({
    handleNext,
  }));

  const updateFormData = (field: keyof IMarketConfigurationFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#61687E' }}>
      <View style={styles.formContainer}>
        <View style={{ marginBottom: 16 }}>
          <ThemedText type="title">Market Configuration</ThemedText>
          <ThemedText style={{ color: '#C7D1E7' }} type="default">
            If this criterion is intended to be used as a main criterion, create short names (e.g.
            W, L, D, Home, Away) for higher visibility.
          </ThemedText>
        </View>

        <TextInput
          label="Market name"
          placeholder="e.g. Winner, loser, draw"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          errorMessage={errors.marketName}
        />

        <TextInput
          label="Description"
          placeholder="Explain what this market is for, and avoid confusion when managing."
          value={formData.description}
          errorMessage={errors.description}
          multiline
          style={styles.descriptionInput}
          numberOfLines={4}
          textAlignVertical="top"
          onChangeText={(text) => updateFormData('description', text)}
        />

        <Switch
          label="Create as a draft?"
          description="Draft outcomes are not visible to users until they are published."
          value={formData.isDraft}
          onChange={(value) => updateFormData('isDraft', value)}
        />
      </View>
    </View>
  );
});

MarketConfiguration.displayName = 'MarketConfiguration';

export default MarketConfiguration;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#485164',
  },
  descriptionInput: {
    height: 100,
  },
  wizardContainer: {
    padding: 0,
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  activeLabel: {
    color: '#F3CA41',
    fontWeight: '600',
  },
  inactiveLabel: {
    color: '#C7D1E7',
  },
  activeIndexLabel: {
    color: '#F3CA41',
    fontWeight: '600',
  },
  inactiveIndexLabel: {
    color: '#FFFFFF',
  },
  formContainer: {
    gap: 16,
  },
  button: {
    marginTop: 60,
  },
});
