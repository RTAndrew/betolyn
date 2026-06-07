import React from 'react';

import BottomSheet from '@/components/bottom-sheet';

import { SpaceMemberBottomSheetRouteProps } from './utils';

const RemoveMemberFromSpaceBottomSheet = ({
  router,
  params: { member },
}: SpaceMemberBottomSheetRouteProps<'remove-member-from-space'>) => {
  return (
    <BottomSheet.ModalConfirmation
      closeOnTouchBackdrop={false}
      onClose={() => router.goBack()}
      title={`Remover "${member.user.username}" do canal?`}
      description="O membro será removido do canal e não poderá mais participar em eventos. As suas apostas pendentes irão prevalecer até o seu anúncio ou término."
      onConfirm={async () => {}}
    />
  );
};

export default RemoveMemberFromSpaceBottomSheet;
