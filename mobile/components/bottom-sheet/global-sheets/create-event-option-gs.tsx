import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SheetManager, SheetProps, useProviderContext } from 'react-native-actions-sheet';
import { Checkbox, View } from 'react-native-ui-lib';

import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { ESpaceCreateEventType } from '@/screens/spaces/[id]/create-event/utils';
import { hexToRgba } from '@/utils/hex-rgba';

import BottomSheet from '..';

const options: { type: `${ESpaceCreateEventType}`; label: string; description: string }[] = [
  {
    type: 'auto',
    label: 'Usar um evento existente',
    description:
      'Escolha um evento real e defina as regras por cima. A plataforma trata das equipas, resultados e atualizações automaticamente.',
  },
  {
    type: 'manual',
    label: 'Criar um evento personalizado',
    description: 'Defina as suas equipas, resultados e regras. Controla quando e como decorre.',
  },
];

const CreateEventOptionGS = ({ payload }: SheetProps<'createEventOptionSelection'>) => {
  const context = useProviderContext();

  const spaceId = payload?.spaceId;
  const [selectedOption, setSelectedOption] = useState<`${ESpaceCreateEventType}`>(
    ESpaceCreateEventType.AUTO
  );

  const handleOptionChange = (type: `${ESpaceCreateEventType}`) => {
    setSelectedOption(type);
  };

  const handleCreateEvent = async () => {
    SheetManager.hide('createEventOptionSelection', {
      context,
    });
    router.push(`/(modals)/spaces/${spaceId}/create-event/${selectedOption}`);
  };

  return (
    <BottomSheet>
      <SafeHorizontalView>
        <ThemedText type="title">Como pretende criar este evento?</ThemedText>

        <View style={styles.optionList}>
          {options.map((option) => (
            <Pressable
              style={[
                styles.optionCard,
                selectedOption === option.type ? styles.optionCardSelected : {},
              ]}
              key={option.type}
              onPress={() => handleOptionChange(option.type)}
            >
              <View style={styles.body}>
                <ThemedText style={styles.title}>{option.label}</ThemedText>
                <ThemedText style={styles.description}>{option.description}</ThemedText>
              </View>

              <Checkbox
                iconColor="white"
                borderRadius={100}
                value={selectedOption === option.type}
                color={selectedOption === option.type ? colors.primary : '#8791A5'}
                onValueChange={() => handleOptionChange(option.type)}
              />
            </Pressable>
          ))}
        </View>

        <Button.Root onPress={() => handleCreateEvent()} style={styles.button}>
          Criar evento
        </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  optionList: {
    gap: 16,
    flexDirection: 'column',
    marginTop: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.greyLighter50,
  },
  optionCardSelected: {
    backgroundColor: hexToRgba(colors.primary, 0.12),
    borderColor: colors.primary,
  },
  body: {
    gap: 8,
    flexDirection: 'column',
    maxWidth: '80%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: colors.greyLighter,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
});
export default CreateEventOptionGS;
