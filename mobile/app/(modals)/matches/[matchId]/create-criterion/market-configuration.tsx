import { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Switch from '@/components/forms/switch';
import TextInput from '@/components/forms/text-input';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';

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
      newErrors.marketName = 'O nome do mercado é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
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
    <View style={{ flex: 1, backgroundColor: colors.greyLight }}>
      <View style={styles.formContainer}>
        <View style={{ marginBottom: 16 }}>
          <ThemedText type="title">Configuração do mercado</ThemedText>
          <ThemedText style={{ color: colors.greyLighter }} type="default">
            Se este mercado for usado como mercado principal, use nomes curtos (ex.: 1x2, resultado
            do jogo, total de golos, cartões amarelos) para melhor visibilidade.
          </ThemedText>
        </View>

        <TextInput
          label="Nome do mercado"
          placeholder="ex.: Vencedor, empate, derrota"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          errorMessage={errors.marketName}
        />

        <TextInput
          label="Descrição"
          placeholder="Explique para que serve este mercado e evite dúvidas na gestão e quando os vencedores forem anunciados."
          value={formData.description}
          errorMessage={errors.description}
          multiline
          style={styles.descriptionInput}
          numberOfLines={4}
          textAlignVertical="top"
          onChangeText={(text) => updateFormData('description', text)}
        />

        <Switch
          label="Criar como rascunho?"
          description="Odds em rascunho não ficam visíveis até serem publicadas."
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
    backgroundColor: colors.greyMedium,
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
    color: colors.complementary,
    fontWeight: '600',
  },
  inactiveLabel: {
    color: colors.greyLighter,
  },
  activeIndexLabel: {
    color: colors.complementary,
    fontWeight: '600',
  },
  inactiveIndexLabel: {
    color: colors.white,
  },
  formContainer: {
    gap: 16,
  },
  button: {
    marginTop: 60,
  },
});
