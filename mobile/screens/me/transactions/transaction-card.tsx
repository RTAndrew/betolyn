import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';

interface TransactionCardProps {
  title: string;
  description?: string;
  amount: number | string;
  icon: React.ComponentType<SvgProps>;
  onPress?: () => void;
}

const TransactionCard = ({
  amount,
  description,
  icon: Icon,
  title,
  onPress,
}: TransactionCardProps) => {
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <View style={styles.avatar}>
        <Icon width={24} height={24} color={colors.white} />
      </View>

      <View style={styles.body}>
        <View style={styles.textColumn}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {description && <ThemedText style={styles.description}>{description}</ThemedText>}
        </View>
        <ThemedText style={styles.amount}> {amount} </ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    // backgroundColor: colors.white,
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 100,
    marginRight: 12,
    backgroundColor: colors.greyMedium,
    borderWidth: 1,
    borderColor: colors.greyLight,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  textColumn: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    color: colors.greyLighter,
  },
  amount: {
    flexShrink: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TransactionCard;
