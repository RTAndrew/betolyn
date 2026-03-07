import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { Button } from '@/components/button';
import EmptyState from '@/components/empty-state';

import BottomSheet from '..';

const UnauthenticatedGC = () => {
  return (
    <BottomSheet>
      <EmptyState
        title="Create an account."
        description="Death markets, gossip, sports, custom betting channels and everything in between... BET ALL IN."
      >
        <Button.Root
          style={styles.button}
          onPress={() => {
            router.push('/auth/login');
            SheetManager.hide('unauthenticated');
          }}
        >
          Sign in
        </Button.Root>
      </EmptyState>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});
export default UnauthenticatedGC;
