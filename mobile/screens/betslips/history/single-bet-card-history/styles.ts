import { StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.greyMedium,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    // borderWidth: 0.2,
    borderColor: colors.greyLighter50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  contentRow: {
    flexDirection: 'column',
    gap: 6,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 0,
    gap: 4,
  },
  secondaryText: {
    color: colors.greyLighter50,
  },
  footer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  oddsRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  secondaryValue: {
    fontWeight: '600',
    color: colors.greyLighter,
  },
  potentialPayout: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  dividerLine: {
    height: 0.3,
    backgroundColor: colors.greyLighter50,
  },
});
