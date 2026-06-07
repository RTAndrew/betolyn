import React, { useState } from 'react';

import { UserCard } from '@/components/user-card';
import { ISpace, ISpaceMember } from '@/types';

import SpaceMembersBottomSheetRoutes from './bottomsheet';

interface SpaceMemberCardProps {
  space: ISpace;
  member: ISpaceMember;
}

const SpaceMemberCard = ({ member, space }: SpaceMemberCardProps) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  return (
    <>
      <UserCard
        avatarSize={24}
        style={{ padding: 0 }}
        title={member.user.username}
        onPress={() => {
          if (space.owner.id === member.user.id) return;
          setIsBottomSheetVisible(true);
        }}
      />

      {isBottomSheetVisible && (
        <SpaceMembersBottomSheetRoutes
          visible={true}
          member={member}
          onClose={() => setIsBottomSheetVisible(false)}
        />
      )}
    </>
  );
};

export default SpaceMemberCard;
