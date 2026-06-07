import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import EmptyState from '@/components/empty-state';
import { ErrorFilled } from '@/components/icons';
import { Settings } from '@/components/settings';
import Tag from '@/components/tags';
import { colors } from '@/constants/colors';
import { useGetSpaceMembers } from '@/services';

import SpaceMemberCard from './space-member-card';

interface SpaceMembersProps {
  spaceId: string;
}

const MAX_MEMBERS_COUNT = 10;

const SpaceMembers = ({ spaceId }: SpaceMembersProps) => {
  const { data, isPending, isError } = useGetSpaceMembers({ spaceId });

  const membersCount = data?.data?.length ?? 0;
  const _members = data?.data ?? [];
  const members = membersCount > 10 ? _members.slice(0, 8) : _members;

  const membersTitle = useMemo(() => {
    if (membersCount === 0) return 'Membros';
    if (membersCount === 1) return '1 Membro';
    if (membersCount > 1) return `${membersCount} Membros`;
  }, [membersCount]);

  if (isPending) {
    return <Settings.Skeleton />;
  }

  if (isError || !data) {
    return (
      <Settings.ItemGroup title={membersTitle}>
        <EmptyState size="small" title="Ocorreu um erro ao processar o seu pedido" />
      </Settings.ItemGroup>
    );
  }

  if (members.length === 0) {
    return (
      <Settings.ItemGroup title={membersTitle}>
        <View style={{ paddingVertical: 10 }}>
          <EmptyState
            size="small"
            title="Sem membros"
            icon={<ErrorFilled color={colors.greyLighter50} width={32} height={32} />}
            description="Quem não tem nada a esconder não tem amigos"
          >
            <View style={{ flexDirection: 'column', gap: 10 }}>
              <Button.Root
                size="small"
                shape="rounded"
                typographyStyle={{ fontWeight: '400' }}
                style={{ backgroundColor: '#6B7389' }}
                onPress={() => router.push(`/(modals)/spaces/${spaceId}/add`)}
              >
                Adicionar membro
              </Button.Root>
            </View>
          </EmptyState>
        </View>
      </Settings.ItemGroup>
    );
  }

  return (
    <View>
      <Settings.ItemGroup
        title={membersTitle}
        description={
          membersCount > MAX_MEMBERS_COUNT
            ? {
                title: 'Ver todos',
                onPress: () => router.push(`/spaces/${spaceId}`),
              }
            : undefined
        }
      >
        {members?.map((member) => (
          <Settings.Item
            key={member.id}
            style={{ paddingVertical: 0 }}
            suffixIcon={<Tag.Admin isAdmin={member.isAdmin} />}
            title={<SpaceMemberCard space={member.space} member={member} />}
          />
        ))}
      </Settings.ItemGroup>
    </View>
  );
};

export default SpaceMembers;
