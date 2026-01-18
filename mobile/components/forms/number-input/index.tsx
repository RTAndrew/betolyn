import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, Pressable } from 'react-native';
import TextInput from '../text-input';
import { Add, Subtract } from '@/components/icons';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  status?: 'warning' | 'error' | 'success';
  min?: number;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const NumberInput = ({
  value,
  onChange,
  status,
  min = 0,
  containerStyle,
  inputStyle,
}: NumberInputProps) => {

  const handleChange = (value: number) => {
    if (value < min) {
      onChange(min);
    } else {
      onChange(value);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable onPress={() => onChange(value - 1)} disabled={value <= min}>
        <Subtract opacity={value > min ? 1 : 0.5} />
      </Pressable>
      <TextInput
        status={status}
        keyboardType="numeric"
        value={value.toString()}
        style={{...styles.input, ...inputStyle}}
        onChangeText={(text) => handleChange(Number(text))}
      />
      <Pressable onPress={() => handleChange(value + 1)}>
        <Add />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#485164',
  },
  input: {
    minWidth: 50,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    color: 'white',
    backgroundColor: '#61687E',
  },
});

export default NumberInput;
