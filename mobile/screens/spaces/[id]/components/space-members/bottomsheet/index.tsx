import React, { useMemo } from 'react';
import { Route } from 'react-native-actions-sheet';

import BottomSheet from '@/components/bottom-sheet';
import EmptyState from '@/components/empty-state';
import { Spinner } from '@/components/spinner';
import { colors } from '@/constants/colors';
import { useGetSpaceMemberById } from '@/services';
import { ISpaceMember } from '@/types';

import { AddRemoveSpaceMemberAsAdminBottomSheet } from './add-remove-space-member-as-admin-bs';
import { SpaceMemberMainBottomSheet } from './main';
import RemoveMemberFromSpaceBottomSheet from './remove-member-from-space-bs';
import {
  SPACE_MEMBER_BOTTOM_SHEET_ID,
  SpaceMemberBottomSheetRouteDefinition,
  useSpaceMemberBottomSheetRouter,
} from './utils';

interface SpaceMembersBottomSheetRoutesProps {
  visible: boolean;
  onClose: () => void;
  member: ISpaceMember;
}

const SpaceMembersBottomSheetRoutes = ({
  visible,
  onClose,
  member,
}: SpaceMembersBottomSheetRoutesProps) => {
  const router = useSpaceMemberBottomSheetRouter();

  const { data, isError, isPending } = useGetSpaceMemberById({
    spaceId: member.space.id,
    memberId: member.id,
  });

  const routes = [
    {
      name: 'add-remove-space-member-as-admin',
      component: AddRemoveSpaceMemberAsAdminBottomSheet,
    },
    {
      name: 'remove-member-from-space',
      component: RemoveMemberFromSpaceBottomSheet,
    },
    {
      name: 'main',
      component: SpaceMemberMainBottomSheet,
      params: { member: data?.data ?? member },
    },
  ] satisfies SpaceMemberBottomSheetRouteDefinition[] as Route[];

  const sheetProps = useMemo(
    () => ({
      visible,
      onClose,
      initialRoute: 'main',
      id: SPACE_MEMBER_BOTTOM_SHEET_ID,
      onTouchBackdrop: () => {
        onClose();
        router?.close();
      },
    }),
    [visible, onClose, router]
  );

  if (!visible) {
    return null;
  }

  if (isPending) {
    return (
      <BottomSheet
        key={`${member.id}-pending`}
        {...sheetProps}
        routes={[
          {
            name: 'main',
            component: () => (
              <BottomSheet.EmptyStateWrapper size="large">
                <Spinner size="large" color={colors.white} />
              </BottomSheet.EmptyStateWrapper>
            ),
          },
        ]}
      />
    );
  }

  if (isError && !data) {
    return (
      <BottomSheet
        {...sheetProps}
        key={`${member.id}-error`}
        routes={[
          {
            name: 'main',
            component: () => (
              <BottomSheet.EmptyStateWrapper size="small">
                <EmptyState.NoSearch
                  color={colors.greyLighter50}
                  size="small"
                  title="Membro não encontrado"
                  description="Membro não existente ou pode ter sido removido"
                />
              </BottomSheet.EmptyStateWrapper>
            ),
          },
        ]}
      />
    );
  }

  return (
    <BottomSheet
      {...sheetProps}
      routes={routes}
      key={`${member.id}-${data?.data ? 'fetched' : 'list'}`}
    />
  );
};

export default SpaceMembersBottomSheetRoutes;
