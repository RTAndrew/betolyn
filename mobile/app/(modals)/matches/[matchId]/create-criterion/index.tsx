import ScreenHeader from '@/components/screen-header';
import { ThemedText } from '@/components/ThemedText';
import { useCreateCriterion, useGetMatch } from '@/services';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View, Platform, Alert } from 'react-native';
import { useMemo, useState, useRef } from 'react';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import MarketConfiguration, { IMarketConfigurationFormData } from './market-configuration';
import { Button } from '@/components/button';
import CreateCriterionOutcomes, { ICreateCriterionOdds } from './outcomes';
import { ICreateCriterionScreenRef } from './types';
import Wizard from '@/components/wizard';
import BottomSheet from '@/components/bottom-sheet';
import { CriterionStatusEnum, EOddStatus } from '@/types';

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
      setActiveStep(prev => prev + 1);
    }
  };

  const handleModalConfirmation = () => {
    const criterion = dataCapture['market-configuration'] as IMarketConfigurationFormData;
    const odds = Object.values(dataCapture['outcomes']) as ICreateCriterionOdds[];


    const activeOdds = odds.filter(odd =>
      odd.status === 'ACTIVE'
    ).length;

    const draftOdds = odds.filter(odd =>
      odd.status === 'DRAFT'
    ).length;

    if (!criterion.isDraft) {
      if (activeOdds === 0) {
        Alert.alert('Unable to create market', 'Active market must have at least one active outcome. Please add an active outcome and try again.');
        return;
      }
    }

    let description = '';
    if (activeOdds > 0 && draftOdds === 0) {
      description = `The criterion will be created with only the ${activeOdds} active outcomes.`;
    } else if (draftOdds > 0 && activeOdds === 0) {
      description = `The criterion will be created with only the ${draftOdds} draft outcomes.`;
    } else {
      description = `The criterion will be created with the ${activeOdds} active outcomes and ${draftOdds} draft outcomes.`;
    }

    setIsConfirmationVisible(description);
  }

  const handleSubmit = async () => {
    const criterion = dataCapture['market-configuration'] as IMarketConfigurationFormData;
    const odds = Object.values(dataCapture['outcomes']) as ICreateCriterionOdds[];

    await createCriterion({
      variables: {
        matchId,
        name: criterion.name,
        allowMultipleOdds: true,
        status: criterion.isDraft ? CriterionStatusEnum.DRAFT : CriterionStatusEnum.ACTIVE,
        odds: odds.map(odd => ({
          name: odd.name,
          value: odd.value,
          status: odd.status as EOddStatus,
        })),
      }
    });


    setIsConfirmationVisible(null);
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.dismissAll();
    }
  }

  const handleDataCaptureNext = (type: TScreen, data: unknown) => {
    setDataCapture(prev => ({ ...prev, [type]: data }));
  };

  const activeScreen = useMemo(() => {
    if (activeStep === 0) {
      return <MarketConfiguration data={dataCapture['market-configuration']} ref={screenRef} onDataCaptureNext={handleDataCaptureNext} />
    }

    return <CreateCriterionOutcomes data={dataCapture['outcomes']} ref={screenRef} onDataCaptureNext={handleDataCaptureNext} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  if (isPending) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (error || !data) {
    return <ThemedText>There was a problem loading the match</ThemedText>;
  }

  const subtitle = `${data.data.homeTeam.name} vs ${data.data.awayTeam.name}`;
  const isNextButtonDisabled = Object.keys(dataCapture['outcomes'] ?? {}).length === 0 && activeStep === 1;

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#61687E' }}>

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
              title="New Market"
              iconColor='#61687E'
              style={styles.header}
              description={subtitle}
              onClose={() => router.back()}
            />

            <SafeHorizontalView style={{ backgroundColor: '#485164' }}>
              <Wizard activeIndex={activeStep} steps={[{ label: 'Market' }, { label: 'Outcomes' }]} />
            </SafeHorizontalView>

            <SafeHorizontalView style={styles.body}>
              {activeScreen}

            </SafeHorizontalView>
          </ScrollView>
        </KeyboardAvoidingView>
        <SafeHorizontalView style={styles.buttonContainer}>

          {activeStep > 0 && <Button.Root variant='text' style={styles.button} onPress={() => setActiveStep(prev => prev - 1)}> Previous </Button.Root>}
          <Button.Root disabled={isNextButtonDisabled} style={styles.button} onPress={handleNext}> Next </Button.Root>
        </SafeHorizontalView>
      </View>

      {isConfirmationVisible && <BottomSheet.ModalConfirmation title='Create Criterion'
        description={isConfirmationVisible} onConfirm={handleSubmit} onClose={() => setIsConfirmationVisible(null)}
        onConfirmText='Create criterion'
      />}
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
    backgroundColor: '#485164',
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