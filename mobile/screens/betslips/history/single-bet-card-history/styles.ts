import { StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greyMedium,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 12,
  },
  logos: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 15,
    backgroundColor: colors.greyMedium,
  },
  logoOverlap: {
    marginTop: -6,
  },
  logoPlaceholder: {
    backgroundColor: colors.greyLight,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    gap: 4,
  },
  oddName: {
    fontWeight: '400',
    color: colors.white,
  },
  secondaryText: {
    color: colors.greyLighter,
    marginTop: 2,
  },
  footer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  stake: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },
  oddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  potentialPayout: {
    color: '#E8C547',
    fontWeight: '600',
  },
});
