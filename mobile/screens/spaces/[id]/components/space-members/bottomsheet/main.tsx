import React from 'react';
import { StyleSheet, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import { Trash, UserAdd } from '@/components/icons';
import Tag from '@/components/tags';
import { ThemedText } from '@/components/ThemedText';

import { SpaceMemberBottomSheetRouteProps } from './utils';

export const SpaceMemberMainBottomSheet = ({
  router,
  params: { member },
}: SpaceMemberBottomSheetRouteProps<'main'>) => {
  return (
    <View>
      <BottomSheet.Header
        title={
          <View style={styles.headerTitle}>
            <ThemedText type="default">{member.user.username}</ThemedText>
            <Tag.Admin isAdmin={member.isAdmin} />
          </View>
        }
      />

      <BottomSheet.OptionList>
        <BottomSheet.ActionOption
          icon={<UserAdd color="white" />}
          text={
            member.isAdmin
              ? 'Remover a função de administrador'
              : 'Atribuir função de administrador'
          }
          onPress={() => router.navigate('add-remove-space-member-as-admin', { member })}
        />

        <BottomSheet.ActionOption
          disabled
          text={'Remover do canal'}
          icon={<Trash color="white" />}
          onPress={() => router.navigate('remove-member-from-space', { member })}
        />
      </BottomSheet.OptionList>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
