import { StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';

export const skeletonStyles = StyleSheet.create({
  root: { flexGrow: 1, backgroundColor: colors.greyLight, paddingBottom: 72 },
  transaction: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 24,
  },
  transactionBody: {
    flexDirection: 'column',
    gap: 18,
    height: '100%',
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.greyMedium,
  },
});
