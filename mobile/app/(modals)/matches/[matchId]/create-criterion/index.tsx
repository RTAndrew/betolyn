import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import BottomSheet from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { ThemedText } from '@/components/ThemedText';
import Wizard from '@/components/wizard';
import { colors } from '@/constants/colors';
import { useCreateCriterion, useGetMatch } from '@/services';
import { CriterionStatusEnum, EOddStatus } from '@/types';

import MarketConfiguration, { IMarketConfigurationFormData } from './market-configuration';
import CreateCriterionOutcomes, { ICreateCriterionOdds } from './outcomes';
import { ICreateCriterionScreenRef } from './types';

type TScreen = 'market-configuration' | 'outcomes';

export default function CreateCriterion() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  const screenRef = useRef<ICreateCriterionScreenRef>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState<string | null>(null);
  const [dataCapture, setDataCapture] = useState<Record<`${TScreen}`, any>>({} as any);

  const { data, isPending, error } = useGetMatch({ matchId });
  const { mutateAsync: createCriterion } = useCreateCriterion();

  const handleNext = () => {
    const canContinue = screenRef.current?.handleNext();
    if (!canContinue) return;

    if (activeStep === 1) {
      handleModalConfirmation();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleModalConfirmation = () => {
    const criterion = dataCapture['market-configuration'] as IMarketConfigurationFormData;
    const odds = Object.values(dataCapture['outcomes']) as ICreateCriterionOdds[];

    const activeOdds = odds.filter((odd) => odd.status === 'ACTIVE').length;

    const draftOdds = odds.filter((odd) => odd.status === 'DRAFT').length;

    if (!criterion.isDraft && activeOdds === 0) {
      Alert.alert(
        'Não foi possível criar o mercado',
        'Um mercado ativo tem de ter pelo menos uma odd ativa. Adicione uma odd ativa e tente novamente.'
      );
      return;
    }

    let description = '';
    if (activeOdds > 0 && draftOdds === 0) {
      description = `O mercado será criado apenas com ${activeOdds} odds ativas.`;
    } else if (draftOdds > 0 && activeOdds === 0) {
      description = `O mercado será criado apenas com ${draftOdds} odds em rascunho.`;
    } else {
      description = `O mercado será criado com ${activeOdds} odds ativas e ${draftOdds} odds em rascunho.`;
    }

    setIsConfirmationVisible(description);
  };

  const handleSubmit = async () => {
    const criterion = dataCapture['market-configuration'] as IMarketConfigurationFormData;
    const odds = Object.values(dataCapture['outcomes']) as ICreateCriterionOdds[];

    await createCriterion({
      variables: {
        matchId,
        name: criterion.name,
        allowMultipleOdds: true,
        status: criterion.isDraft ? CriterionStatusEnum.DRAFT : CriterionStatusEnum.ACTIVE,
        odds: odds.map((odd) => ({
          name: odd.name,
          value: odd.value,
          status: odd.status as EOddStatus,
        })),
      },
    });

    setIsConfirmationVisible(null);
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.dismissAll();
    }
  };

  const handleDataCaptureNext = (type: TScreen, data: unknown) => {
    setDataCapture((prev) => ({ ...prev, [type]: data }));
  };

  const activeScreen = useMemo(() => {
    if (activeStep === 0) {
      return (
        <MarketConfiguration
          data={dataCapture['market-configuration']}
          ref={screenRef}
          onDataCaptureNext={handleDataCaptureNext}
        />
      );
    }

    return (
      <CreateCriterionOutcomes
        data={dataCapture['outcomes']}
        ref={screenRef}
        onDataCaptureNext={handleDataCaptureNext}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  if (isPending) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight}>
        <ThemedText>A carregar...</ThemedText>;
      </ScreenWrapper>
    );
  }

  if (error || !data) {
    return <ThemedText>Ocorreu um problema ao carregar o evento</ThemedText>;
  }

  const subtitle = `${data.data.homeTeam.name} vs ${data.data.awayTeam.name}`;
  const isNextButtonDisabled =
    Object.keys(dataCapture['outcomes'] ?? {}).length === 0 && activeStep === 1;

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.greyLight }}>
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            stickyHeaderIndices={[0, 1]}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <ScreenHeader
              type="close"
              title="Novo mercado"
              iconColor="white"
              style={styles.header}
              description={subtitle}
              onClose={() => router.back()}
            />

            <SafeHorizontalView style={{ backgroundColor: colors.greyMedium, paddingTop: 22 }}>
              <Wizard activeIndex={activeStep} steps={[{ label: 'Mercado' }, { label: 'Odds' }]} />
            </SafeHorizontalView>

            <SafeHorizontalView style={styles.body}>{activeScreen}</SafeHorizontalView>
          </ScrollView>
        </KeyboardAvoidingView>
        <SafeHorizontalView style={styles.buttonContainer}>
          {activeStep > 0 && (
            <Button.Root
              variant="text"
              style={styles.button}
              onPress={() => setActiveStep((prev) => prev - 1)}
            >
              Anterior
            </Button.Root>
          )}
          <Button.Root disabled={isNextButtonDisabled} style={styles.button} onPress={handleNext}>
            Próximo
          </Button.Root>
        </SafeHorizontalView>
      </View>

      {isConfirmationVisible && (
        <BottomSheet.ModalConfirmation
          title="Criar mercado"
          description={isConfirmationVisible}
          onConfirm={handleSubmit}
          onClose={() => setIsConfirmationVisible(null)}
          onConfirmText="Criar mercado"
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
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

  body: {
    marginTop: 24,
    paddingTop: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    position: 'absolute',
    bottom: 60,
    right: 0,
    left: 0,
    flex: 1,
  },
  button: {
    flex: 1,
    maxWidth: '48%',
  },
});
