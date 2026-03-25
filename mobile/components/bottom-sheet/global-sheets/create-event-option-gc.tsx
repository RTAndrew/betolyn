import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Checkbox, View } from 'react-native-ui-lib';

import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { hexToRgba } from '@/utils/hex-rgba';

import BottomSheet from '..';

const options: { type: 'auto' | 'manual'; label: string; description: string }[] = [
  {
    type: 'auto',
    label: 'Use an existing event',
    description:
      'Pick a real event. The platform handles teams, scores, and updates automatically.',
  },
  {
    type: 'manual',
    label: 'Create a custom event',
    description: 'Set your own teams, scores, and rules. You control how it runs.',
  },
];

const CreateEventOptionGC = () => {
  const [selectedOption, setSelectedOption] = useState<'auto' | 'manual'>('auto');

  const handleOptionChange = (type: 'auto' | 'manual') => {
    setSelectedOption(type);
  };

  return (
    <BottomSheet containerStyle={styles.container}>
      <SafeHorizontalView>
        <ThemedText type="title">How do you want to create this event?</ThemedText>

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
                borderRadius={100}
                iconColor="white"
                color={selectedOption === option.type ? colors.primary : '#8791A5'}
                value={selectedOption === option.type}
                onValueChange={() => handleOptionChange(option.type)}
              />
            </Pressable>
          ))}
        </View>

        <Button.Root style={styles.button}> Create Match </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.greyDark,
    // paddingTop: 24,
  },
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
export default CreateEventOptionGC;
