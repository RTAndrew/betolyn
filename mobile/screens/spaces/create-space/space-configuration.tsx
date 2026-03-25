import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import TextInput from '@/components/forms/text-input';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useCreateSpace } from '@/services';

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
  onNext,
}: SpaceConfigurationProps) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutateAsync: createSpace } = useCreateSpace();

  const form: SpaceConfigurationFormData = {
    name: data?.name ?? '',
    description: data?.description ?? '',
  };

  const members = allData?.invitation ?? [];

  const formRef = useRef(form);
  formRef.current = form;

  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const handleFieldChange = (field: keyof SpaceConfigurationFormData, value: string) => {
    onChange({
      ...form,
      [field]: value,
    });

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    setNext?.({
      label: 'Create Space',
      variant: 'solid',
      onPress: () => {
        const current = formRef.current;
        const newErrors: FormErrors = {};
        if (!current.name.trim()) {
          newErrors.name = 'Name is required';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
          return;
        }

        SheetManager.show('asyncProcessing', {
          payload: {
            successTitle: 'Space Created',
            loadingTitle: 'Creating Space',
            errorTitle: 'Error Creating Space',
            successMessage:
              'You can now create events and invite more members to grow your community',
            onSuccessClose: () => {
              router.dismissAll();
              router.push('/spaces');
              SheetManager.hide('asyncProcessing');
            },
            fnPromise: () =>
              createSpace({
                variables: {
                  name: current.name,
                  description: current.description,
                  userIds: members.map((m) => m.id),
                },
              }),
          },
        });
      },
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
            label="Name"
            style={styles.input}
            value={form.name}
            errorMessage={errors.name}
            placeholder="e.g. My Space"
            onChangeText={(text) => handleFieldChange('name', text)}
          />

          <TextInput
            label="Description"
            style={styles.input}
            value={form.description}
            errorMessage={errors.description}
            placeholder="e.g. Weeked football"
            onChangeText={(text) => handleFieldChange('description', text)}
          />

          {members.length > 0 && (
            <Settings.ItemGroup
              title={`${members.length} Member${members.length === 1 ? '' : 's'}`}
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
