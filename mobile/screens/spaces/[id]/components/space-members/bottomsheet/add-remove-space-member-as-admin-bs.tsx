import React from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { useAddOrRemoveMemberAsAdmin } from '@/services';

import { SpaceMemberBottomSheetRouteProps } from './utils';

export const AddRemoveSpaceMemberAsAdminBottomSheet = ({
  router,
  params: { member },
}: SpaceMemberBottomSheetRouteProps<'add-remove-space-member-as-admin'>) => {
  const { mutateAsync: addOrRemoveMemberAsAdmin, isPending } = useAddOrRemoveMemberAsAdmin();

  const handleConfirm = async () => {
    await addOrRemoveMemberAsAdmin({
      memberId: member.id,
      spaceId: member.space.id,
      variables: {
        value: !member.isAdmin,
      },
    });
  };

  return (
    <BottomSheet.ModalConfirmation
      onConfirm={handleConfirm}
      onConfirmText={'Adicionar'}
      onClose={() => router.close()}
      closeOnTouchBackdrop={!isPending}
      onTouchBackdrop={() => router.close()}
      title={`${member.isAdmin ? 'Remover' : 'Adicionar'} "${member.user.username}" como administrador?`}
      description="Como administrador, este membro poderá gerir eventos, adicionar e remover membros do canal, e ver o histórico de transações."
    />
  );
};
