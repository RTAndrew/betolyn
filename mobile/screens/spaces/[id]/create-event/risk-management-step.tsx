import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { NumberInput } from '@/components/forms';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';

import { CreateSpaceEventWizardStepProps } from './utils';

type RiskProps = CreateSpaceEventWizardStepProps<'risk'>;

export const RiskManagementStep = ({ data, onChange, setNext, goNext }: RiskProps) => {
  const liability = data?.maxReservedLiability ?? 0;

  const [error, setError] = useState<string | undefined>();

  const handleChange = (maxReservedLiability: number) => {
    onChange({ maxReservedLiability });
    if (error) setError(undefined);
  };

  const handleNextPress = useCallback(() => {
    if (liability <= 0) {
      setError('O limite de risco deve ser maior que 0');
      return;
    }

    onChange({ maxReservedLiability: liability });
    goNext();
  }, [liability, onChange, goNext]);

  useWizardPrimaryAction(handleNextPress);

  useEffect(() => {
    setNext?.({
      label: 'Próximo',
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
        <View style={styles.intro}>
          <ThemedText style={{ color: colors.greyLighter }} type="default">
            Previna perdas definindo o limite de risco que pretende reservar para este evento. Se as
            apostas ultrapassarem este valor, o evento será suspenso automaticamente.
          </ThemedText>
        </View>

        <NumberInput
          label="Limite de risco"
          value={Number(liability)}
          onChange={handleChange}
          errorMessage={error}
        />
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
  intro: {
    marginBottom: 16,
  },
  error: {
    color: colors.secondary,
    marginBottom: 8,
  },
});
