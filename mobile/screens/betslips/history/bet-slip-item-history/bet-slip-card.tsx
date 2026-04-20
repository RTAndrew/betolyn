import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { formatKwanzaAmount, formatOddValue } from '@/utils/number-formatters';

import { styles } from './styles';

export interface BetSlipCardProps {
  title: string;
  stake: number;
  isVoided?: boolean;
  onPress?: () => void;
  description: string;
  tags: React.ReactNode;
  potentialPayout: number;
  style?: StyleProp<ViewStyle>;
  oddValueAtPlacement: number;
}

const BetSlipCard = ({
  oddValueAtPlacement,
  potentialPayout,
  description,
  isVoided,
  onPress,
  style,
  title,
  stake,
  tags,
}: BetSlipCardProps) => {
  return (
    <Pressable onPress={onPress}>
      <SafeHorizontalView style={StyleSheet.flatten([styles.card, style])}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', gap: 6 }}>{tags}</View>
          <ThemedText style={[styles.potentialPayout, isVoided && { color: colors.greyLighter50 }]}>
            {formatKwanzaAmount(potentialPayout)}
          </ThemedText>
        </View>

        <View style={styles.dividerLine} />

        <View style={styles.contentRow}>
          <View style={styles.body}>
            <ThemedText numberOfLines={1} style={isVoided && { color: colors.greyLighter50 }}>
              {title}
            </ThemedText>
            <ThemedText style={styles.secondaryText}>{formatKwanzaAmount(stake)}</ThemedText>
          </View>

          <View style={styles.body}>
            <ThemedText numberOfLines={1} style={styles.secondaryText}>
              {description}
            </ThemedText>
            <ThemedText style={styles.secondaryText}>
              {formatOddValue(oddValueAtPlacement)}
            </ThemedText>
          </View>
        </View>
      </SafeHorizontalView>
    </Pressable>
  );
};

export default BetSlipCard;
