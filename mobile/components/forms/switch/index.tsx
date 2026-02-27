import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Switch as ReactNativeUISwitch } from 'react-native-ui-lib';
import { colors } from '@/constants/colors';

interface SwitchProps {
  label?: string;
  value: boolean;
  description?: string;
  switchStyle?: StyleProp<ViewStyle>;
  onChange: (value: boolean) => void;
}

const Switch = ({ label, value, description, onChange, switchStyle }: SwitchProps) => {
  const handleChange = () => {
    onChange(!value);
  };

  const showLabelAndDescription = label || description;

  return (
    <Pressable style={styles.container} onPress={() => handleChange()}>
      {showLabelAndDescription && (
        <View style={styles.header}>
          {label && <ThemedText style={styles.label}>{label}</ThemedText>}
          {description && <ThemedText style={styles.description}>{description}</ThemedText>}
        </View>
      )}

      <View style={styles.switchContainer}>
        <ReactNativeUISwitch
          onColor={colors.primary}
          offColor={colors.greyMedium}
          value={value}
          style={switchStyle}
          onValueChange={onChange}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    alignSelf: 'stretch',
  },
  switchContainer: {
    flexShrink: 0,
  },
  header: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: colors.greyLighter,
    lineHeight: 18,
  },
});

export default Switch;
