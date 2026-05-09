import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';
import { useCreateSpace } from '@/services';
import { ApiFnReturnType } from '@/utils/react-query';

import { CreateSpaceWizardStepProps, type SpaceConfigurationFormData } from './utils';

const GENERIC_AVATAR = require('@/assets/images/generic-user-profile-image.png');

type SpaceConfigurationProps = CreateSpaceWizardStepProps<'configuration'>;

interface FormErrors {
  name?: string;
  description?: string;
}

export const SpaceConfiguration = ({
  allData,
  data,
  setNext,
  onChange,
  runAsyncSubmit,
}: SpaceConfigurationProps) => {
  const members = allData?.invitation ?? [];
  const formData: SpaceConfigurationFormData = {
    name: data?.name ?? '',
    description: data?.description ?? '',
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutateAsync: createSpace } = useCreateSpace();

  const handleFieldChange = (field: keyof SpaceConfigurationFormData, value: string) => {
    onChange({
      ...formData,
      [field]: value,
    });

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCreateSpace = useCallback(async () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Introduza um nome para o seu espaço';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    runAsyncSubmit?.({
      successTitle: 'Espaço criado',
      loadingTitle: 'A criar espaço',
      errorTitle: 'Erro ao criar espaço',
      successMessage: 'Já pode criar eventos e convidar mais membros para aumentar a comunidade',
      onSuccessClose: (fnResult) => {
        const result = fnResult as ApiFnReturnType<typeof createSpace>;
        if (!result || !result.data) return;
        const { id } = result.data;
        router.dismissTo(`/spaces/${id}`);
      },
      fnPromise: () =>
        createSpace({
          variables: {
            name: formData.name,
            description: formData.description,
            userIds: members.map((m) => m.id),
          },
        }),
    });
  }, [createSpace, formData.description, formData.name, members]);

  useWizardPrimaryAction(() => {
    void handleCreateSpace();
  });

  useEffect(() => {
    setNext?.({
      label: 'Criar espaço',
      variant: 'solid',
    });
  }, [setNext]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <SafeHorizontalView>
        <View style={styles.sections}>
          <TextInput
            label="Nome"
            style={styles.input}
            value={formData.name}
            errorMessage={errors.name}
            placeholder="ex.: Amigos de futebol"
            onChangeText={(text) => handleFieldChange('name', text)}
          />

          <TextInput
            label="Descrição"
            style={styles.input}
            value={formData.description}
            errorMessage={errors.description}
            placeholder="ex.: Futebol de fim de semana"
            onChangeText={(text) => handleFieldChange('description', text)}
          />

          {members.length > 0 && (
            <Settings.ItemGroup
              title={`${members.length} membro${members.length === 1 ? '' : 's'}`}
            >
              {members.map((m) => (
                <Settings.Item
                  key={m.id}
                  suffixIcon={false}
                  title={
                    <View style={styles.memberItem}>
                      <Image
                        source={GENERIC_AVATAR}
                        style={styles.avatarChip}
                        accessibilityIgnoresInvertColors
                      />
                      <ThemedText>{m.username}</ThemedText>
                    </View>
                  }
                />
              ))}
            </Settings.ItemGroup>
          )}
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
  sections: {
    gap: 20,
  },
  input: {
    backgroundColor: colors.greyLight,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
