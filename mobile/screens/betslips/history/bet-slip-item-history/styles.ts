import { StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';
import { hexToRgba } from '@/utils/hex-rgba';

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
    gap: 12,
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
    alignSelf: 'stretch',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
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
    fontWeight: '700',
    color: colors.white,
  },
  dividerLine: {
    height: 1,
    backgroundColor: hexToRgba(colors.greyLighter, 0.15),
  },
});
