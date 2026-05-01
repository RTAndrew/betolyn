import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SheetManager, useProviderContext } from 'react-native-actions-sheet';

import { Button } from '@/components/button';
import EmptyState from '@/components/empty-state';
import { NoUsersFound } from '@/components/illustrations';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { colors } from '@/constants/colors';

import BottomSheet from '..';

const UnauthenticatedGC = () => {
  const context = useProviderContext();

  return (
    <BottomSheet>
      <SafeHorizontalView>
        <EmptyState
          title="Create an account"
          description="BET ALL IN... Death markets, gossip, sports, custom betting channels and everything in between."
          icon={
            <NoUsersFound
              width={150}
              height={150}
              fill={colors.greyLight}
              color={colors.greyMedium}
            />
          }
        >
          <Button.Root
            style={styles.button}
            onPress={() => {
              router.push('/auth/login');
              SheetManager.hide('unauthenticated', {
                context,
              });
            }}
          >
            Sign in
          </Button.Root>
        </EmptyState>
      </SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});
export default UnauthenticatedGC;
