import BottomSheet, { BottomSheetProps } from '@/components/bottom-sheet';
import Button from '@/components/button';
import { OddButton } from '@/components/odd-button';
import { ThemedView } from '@/components/ThemedView';
import { IMatch } from '@/mock/matches';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';

interface InputProps extends Omit<TextInputProps, 'placeholder'> {
  label: string;
  placeholder: string;
}

const Input = ({ label, placeholder, ...props }: InputProps) => {
  return (
    <View>
      <Text style={styles.inputTitle}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#BFBFBF"
        {...props}
      />
    </View>
  );
};

interface FormProps extends BottomSheetProps {
  onSubmit: ({
    probability,
    minimumAmount,
    maximumAmount,
  }: {
    probability: string;
    minimumAmount: string;
    maximumAmount: string;
  }) => void;
}

const FormSheet = ({ onSubmit, visible = true, onClose }: FormProps) => {
  const [probability, setProbability] = useState<string>('');
  const [minimumAmount, setMinimumAmount] = useState<string>('');
  const [maximumAmount, setMaximumAmount] = useState<string>('');

  const handleCreateOdd = () => {
    onSubmit({ probability, minimumAmount, maximumAmount });
    onClose();
  };

  return (
    <BottomSheet
      gestureEnabled
      visible={visible}
      onClose={onClose}
      containerStyle={{ backgroundColor: '#61687E' }}
    >
      <ThemedView style={styles.oddForm}>
        <Input
          label="Probabilidade"
          placeholder="Nome da odd"
          value={probability}
          onChangeText={setProbability}
        />
        <Input
          label="Valor mínimo (AOA)"
          placeholder="100"
          keyboardType="numeric"
          value={minimumAmount}
          onChangeText={setMinimumAmount}
        />
        <Input
          label="Valor máximo (AOA)"
          placeholder="100"
          keyboardType="numeric"
          value={maximumAmount}
          onChangeText={setMaximumAmount}
        />

        <Button.Root disabled={!probability} onPress={handleCreateOdd}>
          Adicionar
        </Button.Root>
      </ThemedView>
    </BottomSheet>
  );
};

const ChannelCreateOdds = ({ match, onSave }: { match: IMatch; onSave: () => void }) => {
  const [odds, setOdds] = useState<string[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  return (
    <>
      <ThemedView style={styles.container}>
        <Text style={styles.title}>ChannelCreateOdds</Text>

        <View style={styles.oddList}>
          <OddButton
            onPress={() => setIsFormVisible(true)}
            variant="secondary"
            odd={{
              id: 1,
              name: 'Adicionar',
              value: 'Adicionar',
              minimum_amount: 1.0,
              maximum_amount: 1.0,
              created_by: 'system',
            }}
          />

          {odds.map((odd) => (
            <OddButton
              key={odd}
              // onPress={() => actionSheetRef.current?.show()}
              odd={{
                id: 1,
                name: odd,
                value: odd,
                minimum_amount: 1.0,
                maximum_amount: 1.0,
                created_by: 'system',
              }}
            />
          ))}
        </View>

        <ThemedView style={styles.footer}>
          <Button.Root
            disabled={odds.length === 0}
            onPress={() => setIsConfirmationVisible(true)}
          >
            Seguinte
          </Button.Root>
        </ThemedView>
      </ThemedView>

      <BottomSheet
        title="Criar Critério"
        visible={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
      >
        <ThemedView>
          <Text style={styles.confirmationText}>
            Tem certeza que deseja criar este critério para o event{' '}
            {`${match.home_team} vs ${match.away_team}`}?
          </Text>

          <View style={styles.confirmationButtonWrapper}>
            <Button.Root variant="text" onPress={() => setIsConfirmationVisible(false)}>
              Cancelar
            </Button.Root>
            <Button.Root onPress={onSave}>Confirmar</Button.Root>
          </View>
        </ThemedView>
      </BottomSheet>

      {isFormVisible && (
        <FormSheet
          visible={true}
          onClose={() => setIsFormVisible(false)}
          onSubmit={(data) => {
            setOdds([...odds, data.probability]);
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#61687E',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C7D1E7',
    paddingBottom: 5,
  },
  oddList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#485164',
    borderRadius: 5,
    borderWidth: 1,
    color: 'white',
    borderColor: '#8791A5',
    padding: 10,
  },
  inputTitle: {
    color: 'white',
    marginBottom: 5,
  },
  oddForm: {
    padding: 10,
    gap: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    padding: 0,
  },
  footerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  footerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationText: {
    color: 'white',
    textAlign: 'center',
  },
  confirmationButtonWrapper: {
    gap: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ChannelCreateOdds;
