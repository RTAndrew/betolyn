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
          title="Crie uma conta"
          description="Participe em mercados, desporto e canais personalizados de apostas."
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
            Iniciar sessão
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
